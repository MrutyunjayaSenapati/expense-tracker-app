import React from 'react';
import { ViewStyle } from 'react-native';
import { ReportPeriod } from '../../../types/reports';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';

export interface ReportPeriodSelectorProps {
  period: ReportPeriod;
  onChange: (period: ReportPeriod) => void;
  style?: ViewStyle;
}

export const ReportPeriodSelector: React.FC<ReportPeriodSelectorProps> = ({
  period,
  onChange,
  style,
}) => {
  return (
    <SegmentedControl
      options={[
        { value: 'week', label: 'Week' },
        { value: 'month', label: 'Month' },
        { value: 'year', label: 'Year' },
      ]}
      value={period}
      onChange={val => onChange(val as ReportPeriod)}
      semanticColoring={false}
      style={style}
      testID="report-period"
    />
  );
};
