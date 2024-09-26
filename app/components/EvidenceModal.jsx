import React from "react";
import { Modal } from '@shopify/polaris'

function EvidenceModal({ show, closeModal, source }){
    return(
        <Modal
            open={show}
            onClose={closeModal}
            title="Vista de Evidencia"
            primaryAction={{
                content: 'Cerrar',
                onAction: () => {
                    closeModal()
                },
            }}
        >
            <Modal.Section>
                <img src={source} alt="Evidencia Grande" style={{ width: '100%' }} />
            </Modal.Section>
        </Modal>
    );
}

export default EvidenceModal;
