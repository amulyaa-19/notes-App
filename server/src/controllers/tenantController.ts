import type { Request, Response } from 'express';
import prisma from '../db.js';

export const upgradeTenant = async (req: Request, res: Response) => {
  if (req.user!.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Only admins can upgrade plans.' });
  }
  const updatedTenant = await prisma.tenant.update({
    where: {
      id: req.user!.tenantId,
    },
    data: {
      plan: 'PRO',
    },
  });

  res.json(updatedTenant);
};