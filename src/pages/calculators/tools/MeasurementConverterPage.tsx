
import React from 'react';
import { Helmet } from "react-helmet-async";  // ADD THIS
import Layout from '@/components/layout/Layout';
import MeasurementConverter from '@/components/calculators/tools/MeasurementConverter';

const MeasurementConverterPage = () => {
  return (
    <Layout>
      <Helmet>
            <title>Unit Converter | Measurement Converter | Fiscal Compass</title>
            <meta name="description" content="Convert between units of length, weight, volume, temperature, and more. Metric to imperial conversions." />
      </Helmet>
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
