// Data Visualization
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar';
  title: string;
  responsive: boolean;
  maintainAspectRatio: boolean;
}

export function generateLineChart(data: any[], xField: string, yField: string): ChartData {
  return {
    labels: data.map(d => d[xField]),
    datasets: [
      {
        label: yField,
        data: data.map(d => d[yField]),
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
      },
    ],
  };
}

export function generateBarChart(categories: string[], values: number[]): ChartData {
  return {
    labels: categories,
    datasets: [
      {
        label: 'Values',
        data: values,
        borderColor: '#14b8a6',
        backgroundColor: '#14b8a6',
      },
    ],
  };
}

export function generatePieChart(labels: string[], data: number[]): ChartData {
  const colors = ['#14b8a6', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
  return {
    labels,
    datasets: [
      {
        label: 'Distribution',
        data,
        borderColor: colors,
        backgroundColor: colors.map(c => c + '80'),
      },
    ],
  };
}

export function exportChartAsImage(chartElement: HTMLCanvasElement, filename: string): void {
  const link = document.createElement('a');
  link.href = chartElement.toDataURL('image/png');
  link.download = `${filename}.png`;
  link.click();
}

export function compareCharts(chart1Data: ChartData, chart2Data: ChartData): ChartData {
  return {
    labels: chart1Data.labels,
    datasets: [
      ...chart1Data.datasets,
      ...chart2Data.datasets.map(d => ({
        ...d,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
      })),
    ],
  };
}

export function customizeChart(config: ChartConfig, data: ChartData): any {
  return {
    type: config.type,
    data,
    options: {
      responsive: config.responsive,
      maintainAspectRatio: config.maintainAspectRatio,
      plugins: {
        title: {
          display: true,
          text: config.title,
        },
      },
    },
  };
}

export function generateHeatmap(data: number[][]): ChartData {
  const labels = data.map((_, i) => `Week ${i + 1}`);
  return {
    labels,
    datasets: [
      {
        label: 'Intensity',
        data: data.flat(),
        borderColor: '#14b8a6',
        backgroundColor: '#14b8a6',
      },
    ],
  };
}

export function generateRadarChart(categories: string[], values: number[]): ChartData {
  return {
    labels: categories,
    datasets: [
      {
        label: 'Performance',
        data: values,
        borderColor: '#14b8a6',
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
      },
    ],
  };
}
