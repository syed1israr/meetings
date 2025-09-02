import { JSX, useState } from 'react'
import { ResponsiveDialog } from '@/components/Responsive-dialoge'
import { Button } from '@/components/ui/button'

export const useConfirm = (
    title : string,
    description : string
):[()=>JSX.Element, ()=>Promise<unknown>] => {

    const [state, setState] = useState<{
        resolve: (value: boolean) => void
    } | null>(null)

    const confirm = () => {
        return new Promise((resolve) => {
            setState({resolve});
        })
    }

    const handleClose = () => setState(null)

    const handleConfirm = () => {
        state?.resolve(true)
        handleClose()
    }
    
    const handleCancel = () => {
        state?.resolve(false)
        handleClose()
    }

    const ConfirmationDialog = () => (
        <ResponsiveDialog
            open={state !== null}
            onOpenChange={handleClose}
            title={title || ''}
            description={description || ''}
        >
            <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                <Button onClick={handleCancel} variant="outline" className="w-full lg:w-auto">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} className="w-full lg:w-auto">
                    Confirm
                </Button>
            </div>
        </ResponsiveDialog>
    )

    return [ConfirmationDialog, confirm]
}
