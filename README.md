<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

# SocialPlatform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/username/socialplatform/releases)

A scalable, modular NestJS-based social platform for managing user interactions, memberships, payments, and scheduling with integrations like Calendly and Zoom.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

SocialPlatform is a backend application built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/) to facilitate social interactions, user management, and service-based transactions. It supports features like user authentication, media uploads, membership plans, payment processing with Stripe, and scheduling integrations with Calendly and Zoom.

## Features

- **Authentication**: JWT-based authentication with role-based access control.
- **User Management**: Profiles, dashboards, and settings for users, supporters, and admins.
- **Membership System**: Subscription plans with rewards and payment processing via Stripe.
- **Media Management**: Image and media file uploads with Cloudinary integration.
- **Scheduling**: Integration with Calendly for event scheduling and Zoom for video calls.
- **Messaging**: Real-time messaging and member list management.
- **Admin Dashboard**: Analytics and management tools for administrators.
- **Payment Processing**: Secure payments and payouts using Stripe.
- **API Documentation**: Swagger-based API documentation for easy integration.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [PNPM](https://pnpm.io/) (v8.x or higher)
- [Docker](https://www.docker.com/) (for containerized deployment)
- [PostgreSQL](https://www.postgresql.org/) (or another Prisma-supported database)
- [Cloudinary](https://cloudinary.com/) account for media storage
- [Stripe](https://stripe.com/) account for payment processing
- [Calendly](https://calendly.com/) and [Zoom](https://zoom.us/) API keys for scheduling

## Installation

Follow these steps to set up and run the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/username/socialplatform.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd socialplatform
   ```

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Set up environment variables**:
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your database URL, Cloudinary credentials, Stripe keys, and API keys for Calendly and Zoom.

5. **Set up the database**:
   - Run Prisma migrations to set up the database schema:
     ```bash
     npx prisma migrate dev
     ```

6. **Run the application**:
   - For development:
     ```bash
     pnpm run start:dev
     ```
   - For production (using Docker):
     ```bash
     docker-compose up --build
     ```

## Project Structure

The project follows NestJS conventions with a modular structure, including Prisma for database management, Cloudinary for media uploads, and Stripe for payments. Below is the complete file structure:

```
├── .dockerignore
├── .env.example
├── .github
│   └── workflows
│       └── deploy.yml
├── .gitignore
├── .prettierrc
├── .secrets
├── Dockerfile
├── README.md
├── docker-compose.yml
├── eslint.config.mjs
├── gitCommit.txt
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── prisma.config.ts
├── prisma
│   ├── migrations
│   └── models
│       ├── appointments.prisma
│       ├── enum.prisma
│       ├── follower.prisma
│       ├── image.prisma
│       ├── media.prisma
│       ├── membership.prisma
│       ├── membership_reward.prisma
│       ├── message.prisma
│       ├── payment_details.prisma
│       ├── permission_access.prisma
│       ├── post.prisma
│       ├── reschedule-request.prisma
│       ├── schema.prisma
│       ├── services.prisma
│       ├── shop.prisma
│       ├── supporter.prisma
│       ├── user-availability.prisma
│       ├── user-visit.prisma
│       ├── user.prisma
│       └── zoom.prisma
├── public
│   └── sharif.txt
├── sedule.json
├── src
│   ├── @types
│   │   └── index.ts
│   ├── app-metadata
│   │   └── app-metadata.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── auth
│   │   ├── auth-handler
│   │   │   ├── dto
│   │   │   │   └── profile.dto.ts
│   │   │   ├── repository.ts
│   │   │   ├── service.ts
│   │   │   └── utils
│   │   │       ├── constants.ts
│   │   │       ├── index.ts
│   │   │       └── select.ts
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── dto
│   │   │   ├── create-auth.dto.ts
│   │   │   ├── create-or-login.ts
│   │   │   ├── signup-auth.dto.ts
│   │   │   ├── update-auth.dto.ts
│   │   │   └── varify.dto.ts
│   │   ├── entities
│   │   │   └── auth.entity.ts
│   │   ├── guard
│   │   │   ├── auth.guard.spec.ts
│   │   │   ├── auth.guard.ts
│   │   │   ├── jwt.guard.ts
│   │   │   ├── jwtPayloadType.ts
│   │   │   ├── public.decorator.ts
│   │   │   ├── role.enum.ts
│   │   │   └── roles.decorator.ts
│   │   └── strategies
│   │       └── jwt.strategy.ts
│   ├── common
│   │   ├── dto
│   │   │   ├── pagination
│   │   │   │   └── common-query-dto.ts
│   │   │   ├── pi_stripeId.dto.ts
│   │   │   └── structured-array.dto.ts
│   │   ├── fillters
│   │   │   └── http-exception.fillter.ts
│   │   ├── mail
│   │   │   ├── global-mail.module.ts
│   │   │   ├── global-mail.service.ts
│   │   │   ├── global.mail-context.type.ts
│   │   │   └── templates
│   │   │       ├── base-layout.ts
│   │   │       ├── friend-request.template.ts
│   │   │       └── otp.template.ts
│   │   └── utils
│   │       ├── common-responseData.ts
│   │       ├── cookie-handler.ts
│   │       ├── dynamic-cron.util.ts
│   │       ├── generateCode.ts
│   │       ├── http-status.enum.ts
│   │       ├── image-validation.pipe.ts
│   │       ├── request.handler.ts
│   │       ├── send-response.util.ts
│   │       ├── stringToBoolean.pipe.ts
│   │       ├── stripeAmountCalculation.ts
│   │       ├── stripeAmountConvert.ts
│   │       └── sup-profile.resData.ts
│   ├── config
│   │   └── swagger
│   │       └── index.ts
│   ├── constants
│   │   ├── index.ts
│   │   └── ttl.constants.ts
│   ├── main.ts
│   ├── main
│   │   ├── calendly
│   │   │   ├── calendly.controller.ts
│   │   │   ├── calendly.module.ts
│   │   │   ├── calendly.repository.ts
│   │   │   ├── calendly.service.ts
│   │   │   ├── calendly.webhook.ts
│   │   │   ├── constants
│   │   │   │   └── index.ts
│   │   │   ├── dto
│   │   │   │   ├── create-event.dto.ts
│   │   │   │   ├── create-question.dto.ts
│   │   │   │   └── location.dto.ts
│   │   │   ├── schedul.service.ts
│   │   │   ├── types
│   │   │   │   ├── calendly.types.ts
│   │   │   │   ├── event.response.types.ts
│   │   │   │   └── webhookPayload.ts
│   │   │   └── utils
│   │   │       └── index.ts
│   │   ├── dashboard
│   │   │   ├── admin
│   │   │   │   ├── admin.controller.ts
│   │   │   │   ├── admin.module.ts
│   │   │   │   └── services
│   │   │   │       ├── bar-stars.service.ts
│   │   │   │       ├── general-user.service.ts
│   │   │   │       └── overview.service.ts
│   │   │   ├── suppoter-dashboard
│   │   │   │   ├── dto
│   │   │   │   │   └── update.account.dto.ts
│   │   │   │   ├── suppoter-dsahboard.controller.ts
│   │   │   │   ├── suppoter-dsahboard.module.ts
│   │   │   │   ├── suppoter-dsahboard.service.ts
│   │   │   │   └── videocall.service.ts
│   │   │   └── user-dashboard
│   │   │       ├── dto
│   │   │       │   ├── create-user-dashboard.dto.ts
│   │   │       │   └── update-user-dashboard.dto.ts
│   │   │       ├── entities
│   │   │       │   └── user-dashboard.entity.ts
│   │   │       ├── user-dashboard.controller.spec.ts
│   │   │       ├── user-dashboard.controller.ts
│   │   │       ├── user-dashboard.module.ts
│   │   │       ├── user-dashboard.service.spec.ts
│   │   │       └── user-dashboard.service.ts
│   │   ├── entertainer
│   │   │   ├── entertainer.controller.ts
│   │   │   ├── entertainer.module.ts
│   │   │   └── entertainer.service.ts
│   │   ├── image
│   │   │   ├── dto
│   │   │   │   ├── create-image-comment.dto.ts
│   │   │   │   ├── create-image.dto.ts
│   │   │   │   ├── find-all-image-comments.dto.ts
│   │   │   │   ├── find-all-images.dto.ts
│   │   │   │   └── update-image.dto.ts
│   │   │   ├── image.controller.ts
│   │   │   ├── image.module.ts
│   │   │   └── image.service.ts
│   │   ├── main.module.ts
│   │   ├── mediafile
│   │   │   ├── dto
│   │   │   │   ├── create-mediafile.dto.ts
│   │   │   │   └── update-mediafile.dto.ts
│   │   │   ├── entities
│   │   │   │   └── mediafile.entity.ts
│   │   │   ├── mediafile.controller.spec.ts
│   │   │   ├── mediafile.controller.ts
│   │   │   ├── mediafile.module.ts
│   │   │   └── mediafile.service.ts
│   │   ├── membership
│   │   │   ├── dto
│   │   │   │   ├── MembershipSubscriptionPlan.dto.ts
│   │   │   │   ├── create-all-reward.dto.ts
│   │   │   │   ├── create-membership-Access-plan-details.dto.ts
│   │   │   │   ├── create-membership-level.dto.ts
│   │   │   │   ├── update-membership-level.dto.ts
│   │   │   │   ├── update-membership.dto.ts
│   │   │   │   └── update-reward.dto.ts
│   │   │   ├── entities
│   │   │   │   └── membership.entity.ts
│   │   │   ├── membership.controller.spec.ts
│   │   │   ├── membership.controller.ts
│   │   │   ├── membership.module.ts
│   │   │   ├── membership.service.spec.ts
│   │   │   ├── membership.service.ts
│   │   │   ├── onluUseUserMembershipInfo
│   │   │   │   ├── dto
│   │   │   │   │   ├── buyMembership.dto.ts
│   │   │   │   │   └── createMenbershipPaymentDto.ts
│   │   │   │   ├── paymentDetails.service.ts
│   │   │   │   ├── useMembershipUser.controller.ts
│   │   │   │   └── useMembershipUser.service.ts
│   │   │   ├── pipeline
│   │   │   │   └── membershipSubscriptionPlan.pipe.ts
│   │   │   ├── reward.controller.ts
│   │   │   └── reward.service.ts
│   │   ├── message
│   │   │   ├── member-list-message
│   │   │   │   ├── dto
│   │   │   │   │   ├── create-member-list-message.dto.ts
│   │   │   │   │   └── update-member-list-message.dto.ts
│   │   │   │   ├── entities
│   │   │   │   │   └── member-list-message.entity.ts
│   │   │   │   ├── member-list-message.controller.spec.ts
│   │   │   │   ├── member-list-message.controller.ts
│   │   │   │   ├── member-list-message.module.ts
│   │   │   │   ├── member-list-message.service.spec.ts
│   │   │   │   └── member-list-message.service.ts
│   │   │   ├── message.dto.ts
│   │   │   ├── message.getway.ts
│   │   │   ├── message.module.ts
│   │   │   └── message.services.ts
│   │   ├── middlewares
│   │   │   └── track.middleware.ts
│   │   ├── order
│   │   │   ├── dto
│   │   │   │   ├── create-order.dto.ts
│   │   │   │   ├── find-all-orders.dto.ts
│   │   │   │   └── update-order.dto.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── order.module.ts
│   │   │   └── order.service.ts
│   │   ├── payment
│   │   │   ├── dto
│   │   │   │   ├── create-payment.dto.ts
│   │   │   │   └── update-payment.dto.ts
│   │   │   ├── entities
│   │   │   │   └── payment.entity.ts
│   │   │   ├── payment.controller.spec.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.module.ts
│   │   │   ├── payment.service.spec.ts
│   │   │   └── payment.service.ts
│   │   ├── payout
│   │   │   ├── dto
│   │   │   │   ├── create-payout.dto.ts
│   │   │   │   └── update-payout.dto.ts
│   │   │   ├── entities
│   │   │   │   └── payout.entity.ts
│   │   │   ├── payout.controller.spec.ts
│   │   │   ├── payout.controller.ts
│   │   │   ├── payout.module.ts
│   │   │   ├── payout.service.spec.ts
│   │   │   └── payout.service.ts
│   │   ├── permission-access
│   │   │   ├── dto
│   │   │   │   ├── create-permission-access.dto.ts
│   │   │   │   └── update-permission-access.dto.ts
│   │   │   ├── entities
│   │   │   │   └── permission-access.entity.ts
│   │   │   ├── permission-access.controller.spec.ts
│   │   │   ├── permission-access.controller.ts
│   │   │   ├── permission-access.module.ts
│   │   │   ├── permission-access.service.spec.ts
│   │   │   └── permission-access.service.ts
│   │   ├── permission
│   │   │   ├── permission.controller.ts
│   │   │   ├── permission.module.ts
│   │   │   └── permission.service.ts
│   │   ├── post
│   │   │   ├── dto
│   │   │   │   ├── create-comment.dto.ts
│   │   │   │   ├── create-post.dto.ts
│   │   │   │   ├── find-all-comments.dto.ts
│   │   │   │   ├── find-all-posts.dto.ts
│   │   │   │   └── update-post.dto.ts
│   │   │   ├── post.controller.ts
│   │   │   ├── post.module.ts
│   │   │   └── post.service.ts
│   │   ├── product-category
│   │   │   ├── dto
│   │   │   │   ├── create-product-category.dto.ts
│   │   │   │   ├── find-all-product-categories.dto.ts
│   │   │   │   └── update-product-category.dto.ts
│   │   │   ├── product-category.controller.ts
│   │   │   ├── product-category.module.ts
│   │   │   └── product-category.service.ts
│   │   ├── product
│   │   │   ├── dto
│   │   │   │   ├── create-product.dto.ts
│   │   │   │   └── update-product.dto.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.module.ts
│   │   │   └── product.service.ts
│   │   ├── profile-setting
│   │   │   ├── dto
│   │   │   │   ├── update-password.dto.ts
│   │   │   │   └── update-profile.dto.ts
│   │   │   ├── profile-setting.controller.ts
│   │   │   ├── profile-setting.module.ts
│   │   │   └── profile-setting.service.ts
│   │   ├── services
│   │   │   ├── dto
│   │   │   │   ├── create-services.ts
│   │   │   │   ├── create-serviesorder.ts
│   │   │   │   └── update-serviecs.ts
│   │   │   ├── services.controller.ts
│   │   │   ├── services.module.ts
│   │   │   └── services.service.ts
│   │   ├── supporter-profile
│   │   │   ├── coverPhotoChange.service.ts
│   │   │   ├── dto
│   │   │   │   ├── create-supporter-profile.dto.ts
│   │   │   │   └── update-supporter-profile.dto.ts
│   │   │   ├── entities
│   │   │   │   └── supporter-profile.entity.ts
│   │   │   ├── getPostData.service.ts
│   │   │   ├── getShopData.service.ts
│   │   │   ├── supporter-profile.controller.spec.ts
│   │   │   ├── supporter-profile.controller.ts
│   │   │   ├── supporter-profile.module.ts
│   │   │   ├── supporter-profile.service.spec.ts
│   │   │   └── supporter-profile.service.ts
│   │   ├── supporter
│   │   │   ├── dto
│   │   │   │   ├── create-supporter-layout.ts
│   │   │   │   ├── create-supporter.dto.ts
│   │   │   │   ├── supportCartLayoutQuantity.dto.ts
│   │   │   │   └── update-supporter.dto.ts
│   │   │   ├── entities
│   │   │   │   └── supporter.entity.ts
│   │   │   ├── supporter.controller.spec.ts
│   │   │   ├── supporter.controller.ts
│   │   │   ├── supporter.module.ts
│   │   │   ├── supporter.service.spec.ts
│   │   │   └── supporter.service.ts
│   │   ├── user
│   │   │   ├── dto
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   ├── entities
│   │   │   │   └── user.entity.ts
│   │   │   ├── user-auth-info
│   │   │   │   ├── authUser.service.ts
│   │   │   │   └── response.type.ts
│   │   │   ├── user.controller.spec.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.middleware.ts
│   │   │   ├── user.module.ts
│   │   │   ├── user.service.spec.ts
│   │   │   └── user.service.ts
│   │   ├── video-call-schedul-history
│   │   │   ├── dto
│   │   │   │   ├── create-video-call-schedul-history.dto.ts
│   │   │   │   └── update-video-call-schedul-history.dto.ts
│   │   │   ├── entities
│   │   │   │   └── video-call-schedul-history.entity.ts
│   │   │   ├── video-call-schedul-history.controller.spec.ts
│   │   │   ├── video-call-schedul-history.controller.ts
│   │   │   ├── video-call-schedul-history.module.ts
│   │   │   ├── video-call-schedul-history.service.spec.ts
│   │   │   └── video-call-schedul-history.service.ts
│   │   └── zoom
│   │       ├── dot
│   │       │   ├── create-meeting.dto.ts
│   │       │   └── sk.dto.ts
│   │       ├── zoom.controller.ts
│   │       ├── zoom.module.ts
│   │       └── zoom.service.ts
│   ├── prisma-client
│   │   ├── prisma-client.module.ts
│   │   └── prisma-client.service.ts
│   ├── uploads
│   │   ├── cloudinaryService.ts
│   │   ├── dto
│   │   │   └── index.ts
│   │   ├── example
│   │   │   └── index.ts
│   │   ├── uploads.controller.ts
│   │   ├── uploads.module.ts
│   │   └── uploads.repository.ts
│   └── utils
│       ├── cloudinary
│       │   ├── cloudinary.config.ts
│       │   ├── cloudinary.module.ts
│       │   ├── cloudinary.service.ts
│       │   └── cloudinaryConfig.types.ts
│       ├── ip.ts
│       ├── mail
│       │   ├── mail.module.ts
│       │   └── mail.service.ts
│       └── stripe
│           ├── checkOut.service.ts
│           ├── dto
│           │   ├── checkOutPaymentSessionsDto.ts
│           │   ├── createAccout.dto.ts
│           │   ├── services.dto.ts
│           │   ├── shopPayment.dto.ts
│           │   └── supporterCardPayment.dto.ts
│           ├── refferEarning.service.ts
│           ├── seller.service.ts
│           ├── services.service.ts
│           ├── shopPayment.service.ts
│           ├── stripe.module.ts
│           ├── stripe.service.spec.ts
│           ├── stripe.service.ts
│           └── supporterCard.service.ts
├── test.html
├── test
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   └── setup-jest.ts
├── tsconfig.build.json
└── tsconfig.json
```

## Usage

1. **Start the application**:
   ```bash
   pnpm run start:dev
   ```

2. **Access the API**:
   - The API is available at `http://localhost:3000` (or the port specified in `.env`).
   - Swagger documentation is available at `http://localhost:3000/api`.

3. **Example API Request**:
   Authenticate a user:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
   ```

4. **Run tests**:
   ```bash
   pnpm run test
   ```

## API Documentation

API endpoints are documented using Swagger. Access the interactive documentation at `/api` (e.g., `http://localhost:3000/api`) after starting the server. Key modules include:

- `/auth`: User authentication and registration
- `/user`: User profile management
- `/membership`: Subscription plans and rewards
- `/calendly`: Scheduling events
- `/zoom`: Video call integration
- `/mediafile`: Media uploads and management

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

We use [Semantic Versioning](https://semver.org/) for versioning. See the [tags](https://github.com/username/socialplatform/tags) for available versions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/).
- Thanks to contributors for their support.
- Inspired by modern social platforms and open-source best practices.
- Resources: [NestJS Documentation](https://docs.nestjs.com/), [Prisma Documentation](https://www.prisma.io/docs/), [freeCodeCamp Guide](https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/).

---

*This README was generated using a template inspired by best practices from the GitHub community.*