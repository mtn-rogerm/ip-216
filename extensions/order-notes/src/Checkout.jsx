import React, { useEffect, useState } from "react";
import {
  reactExtension,
  useNote,
  View,
  BlockLayout,
  Heading,
  Button,
  TextField,
  useApplyNoteChange,
  Text
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const currentNoteText = useNote();
  const applyNoteChange = useApplyNoteChange();
  const [note, setNote] = useState("");
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (currentNoteText !== undefined) {
      setNote(currentNoteText);
    }
  }, [currentNoteText]);

  const saveNote = () => {
    if (note !== undefined && note.trim() !== "") {
      applyNoteChange({
        type: "updateNote",
        note: note,
      });
    }

    setNotification("Note saved!");
    setTimeout(() => setNotification(""), 3000);
  };

  const clearNote = () => {
    applyNoteChange({
      type: "removeNote"
    });

    setNotification("Note cleared!");
    setTimeout(() => setNotification(""), 3000);
  }

  return (
    <BlockLayout rows={["auto", "auto"]} spacing="base">
      <View border="none" padding="none">
        <Heading level={2}>Order Notes</Heading>
      </View>
      <View border="none" padding="none">
        <TextField
          type="text"
          label="Notes"
          multiline
          value={note}
          onChange={setNote}
        />
      </View>
      <View border="none" padding="none">
        <Button kind="primary" onPress={saveNote}>
          Save
        </Button>
        <Button
          kind="secondary"
          onPress={() => {
            setNote("");
            clearNote();
          }}
        >
          Clear
        </Button>
      </View>
      {notification && (
        <View border="none" padding="none">
          <Text variant="heading2xl" as="h3">
            {notification}
          </Text>
        </View>
      )}
    </BlockLayout>
  );
}
