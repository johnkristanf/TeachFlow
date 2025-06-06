import { columns, Payment } from './columns'
import { DataTable } from '@/components/data-table'
import { PrimaryButton } from '@/components/ui/primary-button'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { EssayGradingForm } from '@/components/essay/grading-form'


export default async function EssayPage() {
    async function getData(): Promise<Payment[]> {
        // Fetch data from your API here.
        return [
            {
                id: '728ed52f',
                amount: 100,
                status: 'pending',
                email: 'm@example.com',
            },
            // ...
        ]
    }

    const data = await getData()

    return (
        <div className="mt-5">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl text-blue-500 mb-5">Essays</h1>

                <Dialog>
                    <DialogTrigger asChild>
                        <PrimaryButton color="blue" variant="outline">
                            Grade New Essay
                        </PrimaryButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[1000px] max-h-[600px] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Start Grading</DialogTitle>
                            <DialogDescription>
                                Please select the assessment attributes to guide the automated
                                evaluation. The grading process will proceed based on the criteria
                                you define.
                            </DialogDescription>
                        </DialogHeader>

                        <EssayGradingForm />
                    </DialogContent>
                </Dialog>
            </div>

            <DataTable columns={columns} data={data} isLoading={false} />
        </div>
    )
}

