import {
  reactExtension,
  useNote,
  View,
  BlockLayout,
  Heading,
  TextField,
  useApplyNoteChange
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  let currentNoteText = useNote();
  const applyNoteChange =  useApplyNoteChange();

  const onChange = (value) => {
    applyNoteChange({
      type: 'updateNote',
      note: value
    });
  };

  return (
    <BlockLayout rows={['auto', 'auto']} spacing="base">
      <View border="none" padding="none">
        <Heading level={2}>Order Notes</Heading>
      </View>
      <View border="none" padding="none">
        <TextField type="text" label="Notes" multiline="true" value={currentNoteText} onChange={onChange}/>
      </View>
    </BlockLayout>
  );
};
