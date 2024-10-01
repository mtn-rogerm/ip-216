import React from 'react';
import {
  reactExtension,
  TextField,
  BlockLayout,
  View,
  Heading,
  useSettings,
  useApplyMetafieldsChange,
  useMetafield,
  useAppMetafields
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <CustomerNoteApp />
));

function CustomerNoteApp() {
  const { customer_tag = 'vip', placeholder_text = 'Notes', note_title = 'Customer note' } = useSettings();
  const applyNoteChange =  useApplyMetafieldsChange();
  let noteText = useMetafield({namespace: "custom", key: "notes"});

  const tags = useAppMetafields({type: "customer", namespace: "custom", key: "tags"});

  const isHasTag = tags.find(item => item.metafield.key === 'tags' && item.metafield.value === customer_tag);

  const onNoteChange = (noteValue) => {
    applyNoteChange({
      type: "updateMetafield",
      namespace: "custom",
      key: "notes",
      valueType: "string",
      value: noteValue
    });
  };

  return isHasTag && (
    <BlockLayout rows={['auto', 'auto']} spacing="base">
      {note_title ? (<View border="none" padding="none"><Heading level={2}>{note_title}</Heading></View>) : ''}
      <View border="none" padding="none">
        <TextField name="note" label={placeholder_text} type="text" multiline="true" value={noteText} onChange={onNoteChange}/>
      </View>
    </BlockLayout>
  );
};
