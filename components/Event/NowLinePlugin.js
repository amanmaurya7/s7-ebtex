export default {
    make(options = { color: '#FFFFFF' }) {
        return {
            afterDatasetsDraw: (chart) => {
                if (chart.data.datasets.length === 0) {
                    return;
                }

                const MOCK_DATA_POINTS_COUNT = 20;
                const dataset = chart.data.datasets[0];
                const dataIndex = dataset.data.length - MOCK_DATA_POINTS_COUNT - 1 + 1;
                const xScale = chart.scales['x'];
                const yScale = chart.scales['y'];
                const xCoordinate = xScale.getPixelForValue(dataIndex);
                const yCoordinateTop = yScale.getPixelForValue(yScale.max);
                const yCoordinateBottom = yScale.getPixelForValue(yScale.min);

                chart.ctx.beginPath();
                chart.ctx.moveTo(xCoordinate, yCoordinateTop);
                chart.ctx.lineTo(xCoordinate, yCoordinateBottom);
                chart.ctx.strokeStyle = options.color;
                chart.ctx.lineWidth = 2;
                chart.ctx.stroke();

                chart.ctx.fillStyle = options.color;
                chart.ctx.textAlign = 'center';
                chart.ctx.font = 'bold 12px "Montserrat"';
                chart.ctx.fillText('NOW', xCoordinate, yCoordinateTop - 10);
            },
        };
    },
};