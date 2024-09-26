import React from "react";
import { Modal, Frame} from '@shopify/polaris';

function SaveInfoModal({ show, toggleModal }) {

    return(
        <Frame>
            <div style={{height: '500px'}}>
                <Modal
                activator={show}
                open={show}
                onClose={toggleModal}
                title="Guardar Cambios"
                primaryAction={{
                    destructive: true,
                    content: 'Cancelar',
                    onAction: () => {
                        toggleModal()
                    },
                }}
                secondaryActions={[
                    {
                    content: 'Guardar',
                    onAction: () => {
                        toggleModal()
                    },
                }]}
                >
                <Modal.Section>
                    Si descartas los cambios, no se guardaran los datos que has modificado.
                </Modal.Section>
                </Modal>
            </div>
        </Frame>
    );
}

export default SaveInfoModal;
