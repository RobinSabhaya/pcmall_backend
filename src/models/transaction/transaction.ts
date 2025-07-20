import mongoose from 'mongoose'

async function runWithTransaction(workflowFn : Function) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await workflowFn(session);
    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

export { runWithTransaction };
