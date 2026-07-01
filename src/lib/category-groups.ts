import { Prisma } from '@prisma/client'

type CategoryTx = Prisma.TransactionClient

interface NormalizeOptions {
  movedCategoryId?: string
  requestedGroupNumber?: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export async function normalizeTopLevelCategoryGroups(
  tx: CategoryTx,
  options: NormalizeOptions = {}
) {
  const topLevelCategories = await tx.category.findMany({
    where: { parentId: null },
    orderBy: [{ groupNumber: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      groupNumber: true,
    },
  })

  if (!topLevelCategories.length) {
    return
  }

  let orderedCategoryIds = topLevelCategories.map((category) => category.id)

  if (options.movedCategoryId) {
    const currentIndex = orderedCategoryIds.indexOf(options.movedCategoryId)

    if (currentIndex !== -1) {
      const [movedCategoryId] = orderedCategoryIds.splice(currentIndex, 1)
      const requestedGroupNumber = options.requestedGroupNumber ?? topLevelCategories.length
      const targetIndex = clamp(requestedGroupNumber, 1, topLevelCategories.length) - 1
      orderedCategoryIds.splice(targetIndex, 0, movedCategoryId)
    }
  }

  await Promise.all(
    orderedCategoryIds.map((categoryId, index) =>
      tx.category.updateMany({
        where: {
          OR: [{ id: categoryId }, { parentId: categoryId }],
        },
        data: {
          groupNumber: index + 1,
        },
      })
    )
  )
}
