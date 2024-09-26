import { Modal, Box, TextField, DropZone, InlineStack, Thumbnail, Text } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function UploadTextImageModal({ active, onClose }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  const handleTextChange = useCallback((value) => setText(value), []);

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    []
  );

  const uploadedFiles = files.length > 0 && (
    <InlineStack>
      {files.map((file, index) => (
        <InlineStack key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={
              window.URL.createObjectURL(file)
            }
          />
          <div>
            {file.name} <Text as="legend">{file.size} bytes</Text>
          </div>
        </InlineStack>
      ))}
    </InlineStack>
  );

  return (
    <Modal
      open={active}
      onClose={onClose}
      title="Upload Text and Images"
      primaryAction={{
        content: "Submit",
        onAction: () => {
          // Handle the submission of text and files here
          console.log("Text:", text);
          console.log("Files:", files);
          onClose();
        },
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: onClose,
        },
      ]}
    >
      <Modal.Section>
        <Box>
          <TextField
            label="Enter some text"
            value={text}
            onChange={handleTextChange}
            autoComplete="off"
          />
          <DropZone onDrop={handleDropZoneDrop}>
            {uploadedFiles}
            <DropZone.FileUpload />
          </DropZone>
        </Box>
      </Modal.Section>
    </Modal>
  );
}
