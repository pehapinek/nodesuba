import { Injectable } from '@nestjs/common';
import { IAnonUser } from '../../../utils/decorators/anon-user.interface';
import { CommandResponse } from 'src/utils/models/command-response';
import { PrismaService } from '../../prisma';
import { ReportPostDto } from './report-post.dto';
import { ReportPostResult } from './report-post.result';

@Injectable()
export class ReportPostService {
  constructor(private readonly prisma: PrismaService) {}

  async reportPosts(
    dto: ReportPostDto,
    anonUser: IAnonUser,
  ): Promise<CommandResponse<ReportPostResult>> {
    const uniquePostsIds = [...new Set(dto.postsIds)];

    const postsToReportCount = await this.prisma.post.count({
      where: {
        id: { in: uniquePostsIds },
        boardId: dto.boardId,
      },
    });

    if (uniquePostsIds.length !== postsToReportCount) {
      return new CommandResponse(ReportPostResult.POST_NOT_FOUND);
    }

    const existingReportsCount = await this.prisma.report.count({
      where: {
        post: {
          boardId: dto.boardId,
          id: { in: uniquePostsIds },
          ip: anonUser.ip,
        },
      },
    });

    if (existingReportsCount > 0) {
      return new CommandResponse(ReportPostResult.POST_ALREADY_REPORTED);
    }

    const createReports = uniquePostsIds.map((id) => {
      return this.prisma.report.create({
        data: {
          post: {
            connect: {
              boardId_id: {
                id,
                boardId: dto.boardId,
              },
            },
          },
          reason: dto.reason,
          ip: anonUser.ip,
        },
      });
    });

    try {
      await this.prisma.$transaction(createReports);

      return new CommandResponse(ReportPostResult.OK);
    } catch (err) {
      return new CommandResponse(ReportPostResult.UNKNOWN_ERROR);
    }
  }
}
