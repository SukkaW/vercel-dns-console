import { useCallback } from 'react';

import { Select, Spacer, Text, useScale, useTheme } from '@geist-ui/core';

import SunIcon from '@geist-ui/icons/sun';
import MoonIcon from '@geist-ui/icons/moon';
import DisplayIcon from '@geist-ui/icons/display';

import { themeAtom } from '@/pages/_app';
import { useAtom } from 'jotai';

export const ThemeToggle = () => {
  const { SCALES } = useScale();
  const theme = useTheme();
  const [themeType, setTheme] = useAtom(themeAtom);

  const handleChange = useCallback((value: string | string[]) => {
    if (value === 'dark' || value === 'light' || value === 'system') {
      setTheme(value);
    }
  }, [setTheme]);

  return (
    <div>
      <Text span>
        Theme
      </Text>
      <Spacer inline w={1 / 2} />
      <Select
        h="36px"
        disableMatchWidth
        value={themeType}
        onChange={handleChange}
        title="Switch Themes"
      >
        <Select.Option value="light">
          <span className="select-content">
            <SunIcon size={16} /> Light
          </span>
        </Select.Option>
        <Select.Option value="dark">
          <span className="select-content">
            <MoonIcon size={16} /> Dark
          </span>
        </Select.Option>
        <Select.Option value="system">
          <span className="select-content">
            <DisplayIcon size={16} /> System
          </span>
        </Select.Option>
      </Select>
      <style jsx>{`
          div {
            display: flex;
            padding: ${SCALES.pt(0.5)} ${SCALES.pr(0.75)} ${SCALES.pb(0.5)} ${SCALES.pl(0.75)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)};
            align-items: center;
            justify-items: start;
            color: ${theme.palette.accents_5};
            font-size: ${SCALES.font(0.85)}
          }

          div :global(.select) {
            width: 120px;
            min-width: 120px;
          }

          .select-content {
            width: auto;
            height: 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .select-content :global(svg) {
            margin-right: 10px;
            margin-left: 2px;
          }
        `}</style>
    </div>
  );
};
