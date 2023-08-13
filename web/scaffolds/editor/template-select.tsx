import React from "react";
import * as Popover from "@radix-ui/react-popover";
import Image from "next/image";
import {
  CaretDownIcon,
  Cross2Icon,
  LockClosedIcon,
} from "@radix-ui/react-icons";
import styled from "@emotion/styled";
import { previews, templates, templatesMap } from "@/k/templates";
import { useEditor } from "@/core/states/use-editor";
import { motion } from "framer-motion";
import { SmoothLoadImage } from "@/components/smooth-load-image";

interface TemplateSelectorProps {
  key: string;
  name: React.ReactNode | string;
  iconSrc: string;
}

const TemplateTriggerButton = React.forwardRef(function TemplateTriggerButton(
  props: React.ComponentProps<typeof TemplateTriggerButtonContainer> & {
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
      <Image
        alt="template thumbnail"
        src={data.iconSrc}
        width={44}
        height={44}
      />
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

function TemplatesView({ onSubmit }: { onSubmit: () => void }) {
  const { switchTemplate, template } = useEditor();
  const [focus, setFocus] = React.useState<string>(template.key);

  const sorted_templates = React.useMemo(() => {
    return templates.sort((a, b) => {
      if (a.visibility === "comming_soon") return 1;
      if (b.visibility === "comming_soon") return -1;
      return 0;
    });
  }, []);

  return (
    <TemplatesViewWrapper>
      <div className="templates">
        {sorted_templates.map((template, i) => {
          const locked = template.visibility === "comming_soon";
          return (
            <TemplateMenuItem
              key={template.key}
              name={template.name}
              iconSrc={template.icon}
              selected={focus === template.key}
              locked={locked}
              onClick={() => {
                setFocus(template.key);
              }}
            />
          );
        })}
      </div>
      <div className="presets" key={focus}>
        <div className="images">
          {previews[focus].map((preset, i) => {
            const locked = templatesMap[focus].visibility === "comming_soon";
            return (
              <PresetPreviewImage
                key={i}
                width={277}
                height={208}
                src={preset}
                data-locked={locked}
                onClick={() => {
                  if (locked) return;
                  switchTemplate(focus);
                  onSubmit();
                }}
                alt={"template render preview"}
              />
            );
          })}
        </div>
      </div>
    </TemplatesViewWrapper>
  );
}

const PresetPreviewImage = styled(SmoothLoadImage)`
  border-radius: 8px;
  overflow: hidden;
  object-fit: cover;

  &[data-locked="true"] {
    cursor: not-allowed;
    opacity: 0.5;
  }
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
    locked,
    ...props
  }: TemplateSelectorProps & {
    selected?: boolean;
    locked?: boolean;
  } & React.HTMLAttributes<HTMLButtonElement>,
  forwaredRef?: React.Ref<HTMLButtonElement>
) {
  return (
    <TemplateMenuItemWrapper
      ref={forwaredRef}
      {...props}
      data-selected={selected}
      data-visible={locked ? "false" : "true"}
    >
      <SmoothLoadImage
        alt="template thumbnail"
        src={iconSrc}
        width={44}
        height={44}
      />
      <span style={{ flex: 1 }}>{name}</span>
      {locked && (
        <div className="lock">
          <LockClosedIcon />
        </div>
      )}
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

  &[data-visible="false"] {
    opacity: 0.5;
  }

  .lock {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }
`;

export function TemplateDropdown() {
  const [open, setOpen] = React.useState(false);
  const { template } = useEditor();

  const close = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Popover.Root open={open}>
      <Popover.Trigger asChild>
        <TemplateTriggerButton
          data={{
            key: template.key,
            name: template.name,
            iconSrc: template.icon,
          }}
          onClick={() => {
            setOpen(!open);
          }}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <ContentContainer
          sideOffset={20}
          side="top"
          align="start"
          onEscapeKeyDown={close}
          onPointerDownOutside={close}
          initial={{
            opacity: 0.8,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <TemplatesView
            onSubmit={() => {
              setOpen(false);
            }}
          />
        </ContentContainer>
      </Popover.Portal>
    </Popover.Root>
  );
}

const ContentContainer = styled(motion(Popover.Content))`
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
