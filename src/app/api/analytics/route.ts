import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'admin_auth';

// POST - Record a click event
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin - if so, skip recording
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (adminCookie?.value === 'authenticated') {
      return NextResponse.json({ tracked: false, reason: 'admin' }, { status: 200 });
    }

    const body = await request.json();
    const { elementType, elementText, trackId, pageUrl, sectionId, sessionId } = body;

    if (!trackId || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await prisma.clickEvent.create({
      data: {
        elementType: elementType || 'unknown',
        elementText: (elementText || '').slice(0, 200),
        trackId,
        pageUrl: pageUrl || '',
        sectionId: sectionId || '',
        sessionId,
        userAgent: request.headers.get('user-agent') || '',
        referrer: request.headers.get('referer') || '',
      },
    });

    return NextResponse.json({ tracked: true }, { status: 201 });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// GET - Fetch analytics data (admin only)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (adminCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(todayStart);
    monthStart.setDate(monthStart.getDate() - 30);

    // Parallel queries
    const [
      totalClicks,
      todayClicks,
      weekClicks,
      monthClicks,
      topElements,
      pageStats,
      recentClicks,
      dailyTrend,
      uniqueSessions,
    ] = await Promise.all([
      prisma.clickEvent.count(),
      prisma.clickEvent.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.clickEvent.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.clickEvent.count({ where: { createdAt: { gte: monthStart } } }),
      // Top clicked elements
      prisma.clickEvent.groupBy({
        by: ['trackId', 'elementText'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      // Page stats
      prisma.clickEvent.groupBy({
        by: ['pageUrl'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
      // Recent clicks
      prisma.clickEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          elementType: true,
          elementText: true,
          trackId: true,
          pageUrl: true,
          sessionId: true,
          createdAt: true,
        },
      }),
      // Daily trend (last 7 days) - raw query for SQLite date grouping
      prisma.$queryRawUnsafe(`
        SELECT 
          date(createdAt) as day,
          COUNT(*) as count
        FROM ClickEvent
        WHERE createdAt >= ?
        GROUP BY date(createdAt)
        ORDER BY day ASC
      `, weekStart.toISOString()),
      // Unique sessions
      prisma.clickEvent.groupBy({
        by: ['sessionId'],
        _count: { id: true },
      }),
    ]);

    return NextResponse.json({
      summary: {
        total: totalClicks,
        today: todayClicks,
        week: weekClicks,
        month: monthClicks,
        uniqueVisitors: uniqueSessions.length,
      },
      topElements: topElements.map(e => ({
        trackId: e.trackId,
        text: e.elementText,
        count: e._count.id,
      })),
      pageStats: pageStats.map(p => ({
        url: p.pageUrl,
        count: p._count.id,
      })),
      recentClicks,
      dailyTrend,
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// DELETE - Clear all analytics data (admin only)
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME);
    if (adminCookie?.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.clickEvent.deleteMany();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics DELETE error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
