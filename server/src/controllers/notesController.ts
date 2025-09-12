import type { Request, Response } from "express";
import prisma from "../db.js";

export const getNotes = async (req: Request, res: Response) => {
  const notes = await prisma.note.findMany({
    where: {
      tenantId: req.user!.tenantId,
    },
  });
  res.json(notes);
};

export const createNote = async (req: Request, res: Response) => {
  // subscription check is done here
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: req.user!.tenantId,
    },
  });

  if (tenant && tenant.plan === 'FREE') {
    const noteCount = await prisma.note.count({
      where: {
        tenantId: req.user!.tenantId,
      },
    });

    if (noteCount >= 3) {
      return res.status(403).json({ 
        message: 'Free plan limit of 3 notes reached. Please upgrade to Pro.' 
      });
    }
  }

  // original note creation logic
  const { title, content } = req.body;
  const newNote = await prisma.note.create({
    data: {
      title,
      content,
      tenantId: req.user!.tenantId,
      ownerId: req.user!.userId,
    },
  });
  res.status(201).json(newNote);
};

export const getNoteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Note ID is required" });
  }

  const note = await prisma.note.findFirst({
    where: {
      id: id,
      tenantId: req.user!.tenantId,
    },
  });

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  res.json(note);
};

export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Note ID is required" });
  }

  const { title, content } = req.body;
  const updatedNote = await prisma.note.updateMany({
    where: {
      id: id,
      tenantId: req.user!.tenantId,
    },
    data: {
      title,
      content,
    },
  });

  if (updatedNote.count === 0) {
    return res
      .status(404)
      .json({ message: "Note not found or user not authorized" });
  }
  res.json({ message: "Note updated successfully" });
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Note ID is required" });
  }

  const deletedNote = await prisma.note.deleteMany({
    where: {
      id: id,
      tenantId: req.user!.tenantId,
    },
  });

  if (deletedNote.count === 0) {
    return res
      .status(404)
      .json({ message: "Note not found or user not authorized" });
  }
  res.status(204).send();
};
