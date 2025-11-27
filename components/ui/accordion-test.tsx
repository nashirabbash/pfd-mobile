import React from "react";
import { View } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Text } from "./text";

export function AccordionTest() {
  return (
    <View style={{ padding: 20 }}>
      <Text variant="h2">Accordion Test</Text>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <Text>What is React Native?</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text>
              React Native is a framework for building mobile apps using React
              and JavaScript.
            </Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>
            <Text>How does it work?</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text>
              It compiles to native platform code and provides access to
              platform APIs.
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Text variant="h3">Multiple Selection Example</Text>

      <Accordion type="multiple">
        <AccordionItem value="multi-1">
          <AccordionTrigger>
            <Text>Feature 1</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text>This is feature 1 content.</Text>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="multi-2">
          <AccordionTrigger>
            <Text>Feature 2</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text>This is feature 2 content.</Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}
