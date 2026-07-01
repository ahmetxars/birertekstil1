import { Prisma } from '@prisma/client'

type CategoryTx = Prisma.TransactionClient

function clampGroupNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export async function shiftGroupsForNewTopLevelCategory(
  tx: CategoryTx,
  requestedGroupNumber: number
) {
  const topLevelCount = await tx.category.count({
    where: { parentId: null },
  })

  const groupNumber = clampGroupNumber(requestedGroupNumber, 1, topLevelCount + 1)

  await tx.category.updateMany({
    where: {
      groupNumber: {
        gte: groupNumber,
      },
    },
    data: {
      groupNumber: {
        increment: 1,
      },
    },
  })

  return groupNumber
}

export async function resequenceGroupsAfterTopLevelDelete(
  tx: CategoryTx,
  deletedGroupNumber: number
) {
  await tx.category.updateMany({
    where: {
      groupNumber: {
        gt: deletedGroupNumber,
      },
    },
    data: {
      groupNumber: {
        decrement: 1,
      },
    },
  })
}

export async function moveTopLevelCategoryGroup(
  tx: CategoryTx,
  categoryId: string,
  currentGroupNumber: number,
  requestedGroupNumber: number
) {
  const topLevelCount = await tx.category.count({
    where: { parentId: null },
  })

  const targetGroupNumber = clampGroupNumber(requestedGroupNumber, 1, topLevelCount)

  if (targetGroupNumber === currentGroupNumber) {
    return currentGroupNumber
  }

  if (targetGroupNumber < currentGroupNumber) {
    await tx.category.updateMany({
      where: {
        groupNumber: {
          gte: targetGroupNumber,
          lt: currentGroupNumber,
        },
      },
      data: {
        groupNumber: {
          increment: 1,
        },
      },
    })
  } else {
    await tx.category.updateMany({
      where: {
        groupNumber: {
          gt: currentGroupNumber,
          lte: targetGroupNumber,
        },
      },
      data: {
        groupNumber: {
          decrement: 1,
        },
      },
    })
  }

  await tx.category.updateMany({
    where: {
      OR: [{ id: categoryId }, { parentId: categoryId }],
    },
    data: {
      groupNumber: targetGroupNumber,
    },
  })

  return targetGroupNumber
}
