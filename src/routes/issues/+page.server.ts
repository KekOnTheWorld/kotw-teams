import type { PageServerLoad } from "./$types";

import { prisma } from "$lib/server/prisma";
import { guard } from "$lib/server/guard";
import { safeIssue, type SafeIssue } from "$lib/server/safe";

export const load: PageServerLoad = async ({ locals, params }) => {
    const member = guard(locals);

    try {
        var page = parseInt((params as { page: string }).page) || 0
    } catch(e) {
        var page = 0
    }
    
    const issues = await prisma.issue.findMany({
        where: {
            projectId: member.projectId,
        },
        include: {
            author: true,
            assignee: true,
            comments: {
                include: {
                    author: true
                }
            },
        },
        skip: 10 * page,
        take: 10,
    });

    return {
        issues: issues.map(safeIssue) as SafeIssue[],
        page,
    };
};
