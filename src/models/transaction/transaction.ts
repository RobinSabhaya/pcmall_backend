import mongoose, { ClientSession } from 'mongoose';

async function runWithTransaction<T>(
  workflowFn: (session: ClientSession) => Promise<T>
): Promise<T> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await workflowFn(session);
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
}

export { runWithTransaction };
