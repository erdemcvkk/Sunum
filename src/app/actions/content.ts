'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getSiteContent() {
  return await prisma.siteContent.findMany()
}

export async function updateSiteContent(sectionKey: string, data: {textValue?: string, primaryImageUrl?: string}) {
  await prisma.siteContent.upsert({
    where: { sectionKey },
    update: {
      textValue: data.textValue,
      primaryImageUrl: data.primaryImageUrl
    },
    create: {
      sectionKey,
      textValue: data.textValue,
      primaryImageUrl: data.primaryImageUrl
    }
  })

  revalidatePath('/')
  revalidatePath('/admin/content')
}
