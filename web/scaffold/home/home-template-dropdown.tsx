import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { CaretDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import styled from "@emotion/styled";

interface TemplateSelectorProps {
  name: React.ReactNode;
  iconSrc: string;
}

const TemplateTriggerButton = React.forwardRef(function TemplateTriggerButton(
  props: {
    data: TemplateSelectorProps;
  },
  ref?: React.Ref<HTMLButtonElement>
) {
  const { data } = props;
  return (
    <TemplateTriggerButtonContainer
      ref={ref}
      className="IconButton"
      aria-label="Update dimensions"
      {...props}
    >
      <img alt="template thumbnail" src={data.iconSrc} />
      <span>{data.name}</span>
      <CaretDownIcon />
    </TemplateTriggerButtonContainer>
  );
});

const TemplateTriggerButtonContainer = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: 10px;
  padding: 8px 12px;

  border-radius: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  transition: background-color 0.1s ease-in-out;
`;

function TemplatesView() {
  //
}

export function TemplateDropdown() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <TemplateTriggerButton
          data={{
            name: (
              <>
                <b>Glass</b>
                <br />
                Dispersion
              </>
            ),
            iconSrc: "/lsd/preview/baked-004.1/icon.png",
          }}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="PopoverContent" sideOffset={5}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            TODO
          </div>
          <Popover.Close className="PopoverClose" aria-label="Close">
            <Cross2Icon />
          </Popover.Close>
          <Popover.Arrow className="PopoverArrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
