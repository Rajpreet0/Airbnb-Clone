"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { IconType } from "react-icons"
import qs from 'query-string';

interface CategoryBoxProps {
    label: string,
    selected?: boolean
    icon: IconType
}

const CategoryBox: React.FC<CategoryBoxProps> = ({label, selected, icon: Icon}) => {

    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {
        // Define an Empty Query
        let currentQuery = {};

        // Look through the Params and parse them to be an Object
        if (params) {
            currentQuery = qs.parse(params.toString());
        }

        // Spread that new query and add category to it
        const updatedQuery: any = {
            ...currentQuery,
            category: label
        }

        // Check if our new category is already selected and if then remove from query
        if (params?.get('category') == label) {
            delete updatedQuery.category;
        }

        // Generate the URL string
        const url = qs.stringifyUrl({
            url: '/', // Our Pathname
            query: updatedQuery
        }, { skipNull: true });

        router.push(url);
    }, [label, params, router]);

  return (
    <div 
    onClick={handleClick}
    className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer
                    ${selected ? 'border-b-neutral-800' : 'border-transparent'}
                    ${selected ? 'text-neutral-800' : 'text-neutral-500'} `}>
        <Icon size={26}/>
        <div className="font-medium text-sm">
            {label}
        </div>
    </div>
  )
}

export default CategoryBox