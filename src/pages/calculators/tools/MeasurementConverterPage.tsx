
import React from 'react';
import Layout from '@/components/layout/Layout';
import MeasurementConverter from '@/components/calculators/tools/MeasurementConverter';

const MeasurementConverterPage = () => {
  return (
    <Layout>
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Measurement Converter</h1>
        <p className="text-muted-foreground mb-8">
          Convert between different units of measurement including length, weight, volume, temperature, area, and speed. Perfect for cooking, DIY projects, travel, and more.
        </p>
        <MeasurementConverter />
      </div>
    </Layout>
  );
};

export default MeasurementConverterPage;
