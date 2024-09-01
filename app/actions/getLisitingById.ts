import prisma from "@/app/libs/prismadb";

interface IParams {
    listingsId?: string;
}

export default async function getListingById (
  params: IParams  
) {
    try {
        const { listingsId } = params;

                // If listingId is not provided, return null or throw an error
                if (!listingsId) {
                    throw new Error("listingId is required");
                }
        

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingsId
            },
            include: {
                user: true
            }
        });

        if (!listing) {
            return null
        } 

        return {
            ...listing,
            createdAt: listing.createdAt.toISOString(),
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: 
                    listing.user.emailVerified?.toISOString() || null,
            }
        };
    } catch (error: any) {
        throw new Error(error);
    }
}