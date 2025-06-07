import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Rubric, RubricWithDetails } from '@/types/rubrics'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { DataTable } from '../data-table'
import { rubric_tabs_columns } from './rubric-tabs-columns'

const RubricTypeTabs = () => {
    const [selectedTab, setSelectedTab] = useState<string>('teachflow_rubrics')
    console.log('selectedTab: ', selectedTab)

    const {
        data: rubrics,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['rubrics', selectedTab],
        queryFn: async () => {
            const res = await fetch(`/api/rubrics?source=${selectedTab}`)
            if (!res.ok) throw new Error('Failed to fetch rubrics')
            const data: RubricWithDetails[] = await res.json()
            return data
        },
        enabled: !!selectedTab, // only fetch when tab is set
    })

    console.log('rubrics in tabs with relation: ', rubrics)

    return (
        <Tabs
            defaultValue="teachflow_rubrics"
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-[400px] pl-3 pr-6"
        >
            <TabsList>
                <TabsTrigger value="teachflow_rubrics">TeachFlow Rubrics</TabsTrigger>
                <TabsTrigger value="my_rubrics">My Rubrics</TabsTrigger>
            </TabsList>

            {/* CREATED BY TEACHFLOW TAB RUBRICS */}
            <TabsContent value="teachflow_rubrics">
                <div className="mt-3">
                    <DataTable
                        columns={rubric_tabs_columns}
                        data={rubrics ?? []}
                        isLoading={isLoading}
                        isPaginated={false}
                    />
                </div>
            </TabsContent>

            {/* CREATED BY USER TAB RUBRICS */}
            <TabsContent value="my_rubrics">
                <div className="mt-3">
                    <DataTable
                        columns={rubric_tabs_columns}
                        data={rubrics ?? []}
                        isLoading={isLoading}
                        isPaginated={false}
                    />
                </div>
            </TabsContent>
        </Tabs>
    )
}

export default RubricTypeTabs
