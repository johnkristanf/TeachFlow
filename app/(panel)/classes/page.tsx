'use client'
import React from 'react'
import { UsersIcon, FileIcon } from 'lucide-react' // Assuming you have Heroicons installed
import AddNewClassDialog from '@/components/classes/add-new-classes-dialog'
import { useQuery } from '@tanstack/react-query'
import { Classes } from '@/types/classes'

export default function ClassesPage() {
    const {
        data: classes, // Rename data to classes for clarity
        isLoading,
        isError,
        error,
    } = useQuery<Classes[], Error>({
        queryKey: ['classes'], // Unique key for this query
        queryFn: async (): Promise<Classes[]> => {
            const response = await fetch('/api/classes')
            if (!response.ok) {
                throw new Error('Failed to fetch classes')
            }
            return response.json()
        },
    })

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Classes</h1>
                    <AddNewClassDialog />
                </div>
                <div className="text-center text-gray-600">Loading classes...</div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">Classes</h1>
                    <AddNewClassDialog />
                </div>
                <div className="text-center text-red-500">
                    Error: {error?.message || 'Failed to load classes.'}
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-blue-600">Classes</h1>
                <AddNewClassDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes && classes.length > 0 ? (
                    classes.map((classItem) => (
                        <div
                            key={classItem.id} // Use unique ID for key
                            className="md:w-64 border-l-4 border-blue-400 border rounded-lg p-4 shadow-sm space-y-3"
                        >
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {classItem.name}
                            </h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Created on{' '}
                                {classItem.createdAt
                                    ? new Date(classItem.createdAt).toLocaleString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          hour: 'numeric',
                                          minute: 'numeric',
                                      })
                                    : 'N/A'}
                            </p>
                            <div className="flex space-x-4 text-gray-600 text-sm">
                                <div className="flex items-center space-x-1">
                                    <UsersIcon className="h-4 w-4" />
                                    <span>{classItem.studentCount} students</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    {/* Assuming 0 essays for now, as it's not in the DB schema */}
                                    <FileIcon className="h-4 w-4" />
                                    <span>
                                        {classItem.essayCount && classItem.essayCount <= 1
                                            ? `${classItem.essayCount} essay`
                                            : `${classItem.essayCount} essays`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-600">
                        No classes found. Create a new one!
                    </div>
                )}
            </div>
        </div>
    )
}
