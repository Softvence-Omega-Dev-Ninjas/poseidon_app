import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/guard/role.enum';
import { PrismaService } from 'src/prisma-client/prisma-client.service';
import * as geoip from 'geoip-lite';
import { UserVisit } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly IP_API_URL = 'http://ip-api.com/json/';
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async findAll(
    role: Role,
    currentPage: number = 1,
    limit: number = 10,
    query?: string,
  ) {
    // Validate page and limit
    if (isNaN(currentPage) || currentPage < 1) {
      throw new Error('Invalid page number');
    }

    // Fetch total count of users with the Supporter role
    const totalItemCount = await this.prisma.user.count({
      where: {
        role: role,
        deactivate: false,
      },
    });
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalItemCount / limit);

    // Fetch users based on pagination
    const users = await this.prisma.user.findMany({
      where: {
        role: role,
        deactivate: false,
        OR: [
          {
            username: { contains: query },
          },
          {
            profile: {
              name: { contains: query },
            },
          },
        ],
      },

      skip: (currentPage - 1) * limit,
      take: limit,
      omit: {
        password: true,
        deactivate: true,
        otp: true,
        stripeAccountId: true,
      },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Prepare the pagination response object
    const paginationResponse = {
      currentPage,
      pageSize: limit,
      totalItems: totalItemCount,
      totalPages,
      nextPage: currentPage < totalPages ? currentPage + 1 : null,
      prevPage: currentPage > 1 ? currentPage - 1 : null,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      users, // Users for the current page
    };
    return paginationResponse;
  }

  async findOne(id: string, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
        role,
        deactivate: false,
      },
      omit: {
        password: true,
        otp: true,
        stripeAccountId: true,
        deactivate: true,
      },
      include: {
        profile: {
          select: {
            id: true,
            name: true,
            image: true,
            city: true,
            address: true,
            country: true,
            description: true,
          },
        },
      },
    });
    if (!user) throw new Error('User not found');

    return user;
  }

  async softDelete(id: string, role: Role) {
    let user = await this.prisma.user.findUnique({
      where: {
        id,
        role,
        deactivate: false,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new Error(`Invalid user ID`);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: id,
        role: role,
      },
      data: {
        deactivate: true,
      },
      omit: {
        password: true,
      },
    });

    return updatedUser;
  }

  // Track a user's visit
  async trackVisit(
    ip: string,
    country: string,
    visitDate: Date,
  ): Promise<UserVisit> {
    // TODO(coderboysobuj) get country from request ip using Geolocation
    // Create a new visit record
    return this.prisma.userVisit.create({
      data: {
        ip: ip,
        visitDate: visitDate,
        country: country,
      },
    });
  }

  // Get daily visits count
  async getDailyVisitCount(date: string): Promise<number> {
    // Check date format
    if (!/\d{4}-\d{2}-\d{2}/.test(date)) {
      throw new Error('Invalid date format. Expected format: YYYY-MM-DD');
    }

    // Parse the date string into a Date object (in local time)
    const parsedDate = new Date(date); // This will parse the date into the local timezone

    // Set the start of the day (midnight) and end of the day (23:59:59.999) in UTC
    const startOfDay = new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    const endOfDay = new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );

    const count = await this.prisma.userVisit.count({
      where: {
        visitDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return count;
  }

  // Method to get daily traffic data for a specific range of dates (e.g., last 7 days)
  async getTrafficStatsForRange(startDate: string, endDate: string) {
    const trafficData = await this.prisma.userVisit.groupBy({
      by: ['visitDate'], // Group by visitDate
      where: {
        visitDate: {
          gte: new Date(startDate), // Start date
          lte: new Date(endDate), // End date
        },
      },
      _count: {
        id: true, // Count the number of visits
      },
      orderBy: {
        visitDate: 'asc', // Sort by visitDate (ascending)
      },
    });

    // Format the response to match the chart requirements
    const formattedData = trafficData.map((data) => ({
      date: data.visitDate.toISOString().split('T')[0], // Format date as 'YYYY-MM-DD'
      visits: data._count.id,
    }));

    return formattedData;
  }

  async getTrafficStats(numberOfDay: number = 0) {
    // Get today's date
    const today = new Date();

    // Calculate the start date (7 days ago)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - numberOfDay); // Set to 7 days before today

    // Format the dates to 'YYYY-MM-DD' for easy parsing in the service
    const formattedStartDate = startDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const formattedEndDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    // Fetch traffic stats for the last 7 days
    const trafficStats = await this.getTrafficStatsForRange(
      formattedStartDate,
      formattedEndDate,
    );

    return { data: trafficStats };
  }

  // Check visitor exist with ip
  async existingVisitor(ip: string, visitDate: Date) {
    const existingVisit = await this.prisma.userVisit.findUnique({
      where: {
        ip_visitDate: {
          ip,
          visitDate: visitDate,
        },
      },
    });
    return existingVisit;
  }

  // Get visits by country (group by country)
  async getVisitsByCountry(): Promise<any> {
    const visitorDate = await this.prisma.userVisit.groupBy({
      by: ['country'],
      _count: {
        ip: true, // Count number of visits per country
      },
    });

    const totalVisitor = visitorDate.reduce(
      (sum, item) => sum + item._count.ip,
      0,
    );

    const charData = {
      labels: visitorDate.map((item) => item.country),
      data: visitorDate.map((item) => (item._count.ip / totalVisitor) * 100),
    };

    return charData;
  }

  // Fetch the country based on the IP address
  async getCountryFromIP(ip: string): Promise<string> {
    if (ip === '127.0.0.1' || ip === '::1') {
      return 'Bangladesh';
    }
    const location = geoip.lookup(ip);
    if (location) {
      return location.country;
    }

    return 'unknown';
  }
}
