import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { CaretDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import styled from "@emotion/styled";
import { presetsMap, templates } from "@/k/templates";
import { useEditor } from "@/core/states/use-editor";

interface TemplateSelectorProps {
  key: string;
  name: React.ReactNode | string;
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
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
  &:focus {
    background: rgba(255, 255, 255, 0.2);
  }

  transition: background-color 0.1s ease-in-out;
`;

function TemplatesView() {
  const { switchTemplate } = useEditor();
  const [focus, setFocus] = React.useState<string>("004");

  return (
    <TemplatesViewWrapper>
      <div className="templates">
        {templates.map((template, i) => {
          return (
            <TemplateMenuItem
              key={template.key}
              name={template.name}
              iconSrc={template.icon}
              selected={focus === template.key}
              onClick={() => {
                setFocus(template.key);
              }}
            />
          );
        })}
      </div>
      <div className="presets" key={focus}>
        <div className="images">
          {presetsMap[focus].map((preset, i) => {
            return (
              <PresetPreviewImage
                width="100%"
                key={i}
                src={preset}
                onClick={() => {
                  switchTemplate(focus);
                  // TODO: clear the popover
                }}
              />
            );
          })}
        </div>
      </div>
    </TemplatesViewWrapper>
  );
}

const PresetPreviewImage = styled.img`
  height: 216px;
  border-radius: 8px;
  overflow: hidden;
  object-fit: cover;
`;

const TemplatesViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  max-height: 460px;
  max-width: 550px;

  .templates {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 216px;
    overflow-y: scroll;
  }

  .presets {
    display: flex;
    flex-direction: column;
    width: 280px;
    overflow-y: scroll;

    .images {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
`;

const TemplateMenuItem = React.forwardRef(function TemplateMenuItem(
  {
    name,
    iconSrc,
    selected,
    ...props
  }: TemplateSelectorProps & {
    selected?: boolean;
  } & React.HTMLAttributes<HTMLButtonElement>,
  forwaredRef?: React.Ref<HTMLButtonElement>
) {
  return (
    <TemplateMenuItemWrapper
      ref={forwaredRef}
      {...props}
      data-selected={selected}
    >
      <img alt="template thumbnail" src={iconSrc} width={44} height={44} />
      <span>{name}</span>
    </TemplateMenuItemWrapper>
  );
});

const TemplateMenuItemWrapper = styled.button`
  cursor: pointer;

  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  background: transparent;
  color: white;
  border: none;

  border-radius: 8px;

  gap: 10px;

  padding: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &[data-selected="true"] {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export function TemplateDropdown() {
  const { templateId } = useEditor();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <TemplateTriggerButton
          data={{
            key: templateId,
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
        <ContentContainer sideOffset={20} side="top" align="start">
          <TemplatesView />
          {/* <Popover.Arrow className="PopoverArrow" /> */}
        </ContentContainer>
      </Popover.Portal>
    </Popover.Root>
  );
}

const ContentContainer = styled(Popover.Content)`
  z-index: 99;

  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: 10px;
  padding: 8px 12px;

  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  background: rgba(255, 255, 255, 0.1);
  color: white;

  backdrop-filter: blur(40px);

  transition: background-color 0.1s ease-in-out;
`;
