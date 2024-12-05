import React, { useEffect, useState } from "react";
import {
  reactExtension,
  View,
  useSettings,
  useApplyMetafieldsChange,
  useMetafield,
  BlockLayout,
  Heading,
  TextField,
  useApi,
  Button,
  Text
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <CustomerNoteApp />
));

async function checkTag(email, tag) {
  try {
    const response = await fetch(
      "https://dealt-appliances-youth-standing.trycloudflare.com/check-tag",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, tag }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to check tag");
    }

    const data = await response.json();
    return data.hasTag;
  } catch (error) {
    console.error("Error checking tag:", error);
    return false;
  }
}

function CustomerNoteApp() {
  const { buyerIdentity } = useApi();
  const customerEmail = buyerIdentity?.customer?.current?.email;

  const {
    customer_tag = "VIP",
    placeholder_text = "Notes",
    note_title = "Customer note",
  } = useSettings();

  const applyNoteChange = useApplyMetafieldsChange();
  const currentNoteText = useMetafield({
    namespace: "custom",
    key: "notes",
  });

  const [note, setNote] = useState("");
  const [hasTag, setHasTag] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    if (customerEmail) {
      checkTag(customerEmail, customer_tag).then(setHasTag);
    }
  }, [customerEmail, customer_tag]);

  useEffect(() => {
    if (currentNoteText?.value) {
      setNote(currentNoteText.value);
    }
  }, [currentNoteText]);

  const saveNote = () => {
    applyNoteChange({
      type: "updateMetafield",
      namespace: "custom",
      key: "notes",
      valueType: "string",
      value: note
    });

    setNotification("Note saved!");
    setTimeout(() => setNotification(""), 3000);
  };

  const clearNote = () => {
    applyNoteChange({
      type: "removeMetafield",
      namespace: "custom",
      key: "notes"
    });

    setNotification("Note cleared!");
    setTimeout(() => setNotification(""), 3000);
  }

  if (!hasTag) return null;

  return (
    <BlockLayout rows={["auto", "auto"]} spacing="base">
      {note_title ? (
        <View border="none" padding="none">
          <Heading level={2}>{note_title}</Heading>
        </View>
      ) : null}
      <View border="none" padding="none">
        <TextField
          name="note"
          label={placeholder_text}
          type="text"
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
