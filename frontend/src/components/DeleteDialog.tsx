// @flow 
import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';

interface DeleteDialogProps{
    open:boolean;
    handleClose: (confirmed: boolean) => void;
}
export const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
    const {open, handleClose} = props;
    return (
        <Dialog
            open = {open}
            onClose = {() => handleClose(false)}
        >
            <DialogTitle>
                Exclusão de Registros
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Deseja Realmente exluir este(s) registro(s)?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>handleClose(false)} color="primary">
                    Cancelar
                </Button>
                <Button onClick={()=>handleClose(true)} color="secondary" autoFocus>
                    Excluir
                </Button>
            </DialogActions>

        </Dialog>
    );
};