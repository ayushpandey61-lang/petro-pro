import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportFilterForm from '@/pages/reports/components/ReportFilterForm';
import ReportGenerator from '@/components/reports/ReportGenerator';
import useLocalStorage from '@/hooks/useLocalStorage';

const AllCreditCustomerReport = () => {
    const [creditParties] = useLocalStorage('creditParties', []);
    const [filteredData, setFilteredData] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [title, setTitle] = useState('');
    
    const partyOptions = creditParties.map(p => ({ value: p.id, label: p.organizationName }));

    const handleFilterSubmit = (filters) => {
        let data = [];
        let reportHeaders = [];
        let reportTitle = '';
        
        const reportType = filters.reportType || 'credit_parties';
        
        switch(reportType) {
            case 'credit_parties':
                reportTitle = "Credit Parties Report";
                reportHeaders = [
                    {key: 'organizationName', label: 'Organization'},
                    {key: 'contactPerson', label: 'Contact Person'},
                    {key: 'mobile', label: 'Mobile'},
                    {key: 'creditBalance', label: 'Credit Balance'},
                ];
                data = creditParties;
                break;
            case 'balance':
                reportTitle = "All Customer Balance";
                reportHeaders = [
                    {key: 'organizationName', label: 'Organization'},
                    {key: 'creditBalance', label: 'Balance'},
                ];
                data = creditParties.map(({ organizationName, creditBalance }) => ({ organizationName, creditBalance }));
                break;
            case 'credit_limit_crossed':
                 reportTitle = "Credit Limit Crossed Report";
                 reportHeaders = [
                    {key: 'organizationName', label: 'Organization'},
                    {key: 'creditLimit', label: 'Credit Limit'},
                    {key: 'creditBalance', label: 'Current Balance'},
                ];
                data = creditParties.filter(p => parseFloat(p.creditBalance || 0) > parseFloat(p.creditLimit || 0));
                break;
            default:
                data = [];
        }

        setTitle(reportTitle);
        setHeaders(reportHeaders);
        setFilteredData(data);
    };

    const filterFields = [
        { name: 'reportType', label: 'Report Type', type: 'radio', options: [
            { value: 'credit_parties', label: 'Credit Parties' },
            { value: 'balance', label: 'Balance' },
            { value: 'credit_limit_crossed', label: 'Credit Limit Crossed' }
        ] },
        { name: 'dateRange', label: 'Date Range', type: 'dateRange' },
        { name: 'organization', label: 'Organization', type: 'select', options: partyOptions },
        { name: 'vehicle', label: 'Vehicle', type: 'text' }
    ];

    return (
        <div>
            <ReportFilterForm title="All Credit Customer Report" fields={filterFields} onSubmit={handleFilterSubmit} />
            {filteredData && (
                <ReportGenerator title={title} headers={headers} data={filteredData} />
            )}
        </div>
    );
};

export default AllCreditCustomerReport;