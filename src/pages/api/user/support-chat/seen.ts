import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getIO } from '@/lib/socket';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) return res.status(401).json({ error: 'Unauthorized' });

  const userId = session.user.id;
  const { ids } = req.body;

  try {
    const seenMessage = await prisma.supportChat.updateMany({
      where: {
        id: { in: ids },
        userId,
        sender: 'ADMIN',
        seen: false,
      },
      data: { seen: true },
    });

    getIO()?.emit('message-seen', {
      userId,
      messageIds: ids
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Seen update failed:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
