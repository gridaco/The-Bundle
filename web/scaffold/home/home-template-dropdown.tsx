import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { CaretDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import styled from "@emotion/styled";

interface TemplateSelectorProps {
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
  const templates: TemplateSelectorProps[] = [
    {
      name: "template 1",
      iconSrc: "/lsd/preview/baked-004.1/icon.png",
    },
    {
      name: "template 2",
      iconSrc: "/lsd/preview/baked-004.1/icon.png",
    },
    {
      name: "template 3",
      iconSrc: "/lsd/preview/baked-004.1/icon.png",
    },
  ];

  const presets = [
    "/lsd/pro/hero-columns/01.png",
    "/lsd/pro/hero-columns/02.png",
    "/lsd/pro/hero-columns/03.png",
    "/lsd/pro/hero-columns/04.png",
    "/lsd/pro/hero-columns/05.png",
    "/lsd/pro/hero-columns/06.png",
  ];

  return (
    <TemplatesViewWrapper>
      <div className="templates">
        {templates.map((template, i) => {
          return (
            <TemplateMenuItem
              key={i}
              name={template.name}
              iconSrc={template.iconSrc}
            />
          );
        })}
      </div>
      <div className="presets">
        <div className="images">
          {presets.map((preset, i) => {
            return <PresetPreviewImage width="100%" key={i} src={preset} />;
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

function TemplateMenuItem({ name, iconSrc }: TemplateSelectorProps) {
  return (
    <TemplateMenuItemWrapper>
      <img alt="template thumbnail" src={iconSrc} />
      <span>{name}</span>
    </TemplateMenuItemWrapper>
  );
}

const TemplateMenuItemWrapper = styled.div`
  cursor: pointer;

  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;

  border-radius: 8px;

  gap: 10px;

  padding: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

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
        <ContentContainer sideOffset={5}>
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

  backdrop-filter: blur(40px);

  transition: background-color 0.1s ease-in-out;
`;
