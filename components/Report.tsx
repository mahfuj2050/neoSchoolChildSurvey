import React, { useEffect, useState } from 'react';
import { studentService } from '../services/studentService';
import { Student, AGE_GROUPS, Gender, ClassLevel } from '../types';
import { Printer, Download, AlertCircle } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const Report: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { t } = useAppContext();

  useEffect(() => {
    studentService.getAllStudents()
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load report data:", err);
        setError("Could not load student data. Please check your connection.");
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    const element = document.getElementById('printable-content');
    
    // Configuration for html2pdf
    const opt = {
      margin: [0.3, 0.2], // Top/Bottom, Left/Right
      filename: `Admission_Report_2025_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, // Higher scale for better text clarity
        useCORS: true,
        scrollY: 0,
        // Helper to fix potential white lines or rendering glitches
        onclone: (clonedDoc: Document) => {
          const clonedElement = clonedDoc.getElementById('printable-content');
          if (clonedElement) {
            // Force text color to black to ensure visibility
            clonedElement.style.color = '#000000';
            // Force white background for PDF
            clonedElement.style.backgroundColor = '#ffffff';
            // Remove dark mode class from the cloned document to ensure clean white PDF
            clonedDoc.documentElement.classList.remove('dark');
          }
        }
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    // @ts-ignore - html2pdf is loaded via CDN in index.html
    if (window.html2pdf) {
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save().then(() => {
        setIsGeneratingPdf(false);
      });
    } else {
      alert("PDF library loading... please try again in a moment.");
      setIsGeneratingPdf(false);
    }
  };

  // Helper to calculate cell data
  const getCount = (age: string, gender?: Gender, cls?: string) => {
    return students.filter(s => {
      const ageMatch = s.ageGroup === age;
      const genderMatch = gender ? s.gender === gender : true;
      const classMatch = cls ? s.class === cls : true;
      return ageMatch && genderMatch && classMatch;
    }).length;
  };

  // Calculate totals for footer
  const getTotal = (gender?: Gender, cls?: string) => {
    return students.filter(s => {
      const genderMatch = gender ? s.gender === gender : true;
      const classMatch = cls ? s.class === cls : true;
      return genderMatch && classMatch;
    }).length;
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t('loading')}</div>;

  if (error) return (
    <div className="p-8 flex flex-col items-center justify-center text-red-600 dark:text-red-400">
      <AlertCircle className="w-12 h-12 mb-2" />
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-white">Retry</button>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-center no-print gap-4 px-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('govtReport')}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t('printDesc')}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm cursor-pointer disabled:opacity-70"
          >
            <Download className="w-4 h-4" /> 
            {isGeneratingPdf ? t('genPdf') : t('downloadPdf')}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" /> {t('printReport')}
          </button>
        </div>
      </div>

      {/* Report Container - This ID is targeted by Print CSS and PDF generator */}
      {/* We force bg-white and text-black on the report container itself so it looks paper-like even in dark mode */}
      <div id="printable-content" className="bg-white p-4 shadow-sm print:shadow-none print:p-0 w-full relative z-[9999] text-black">
        
        {/* Report Header */}
        <div className="text-center mb-6 space-y-2 print:mb-4">
            <div className="flex justify-center mb-4">
               {/* Govt Logo */}
               <div className="w-20 h-20">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Government_Seal_of_Bangladesh.svg/240px-Government_Seal_of_Bangladesh.svg.png" 
                    alt="Bangladesh Govt Logo" 
                    className="w-full h-full object-contain"
                  />
               </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-900 print:text-black">{t('schoolName')}</h1>
            <p className="text-sm md:text-base font-semibold text-gray-700 print:text-black">{t('reportTitle')}</p>
            <div className="flex justify-between text-sm mt-8 border-b-2 border-gray-800 pb-2 print:mt-4 font-medium">
                <span>{t('upazila')}</span>
                <span>{t('schoolCode')}</span>
                <span>{t('year')}</span>
            </div>
        </div>

        {/* Report Table */}
        <div className="w-full">
          <table className="w-full border-collapse border border-black text-center text-xs">
            <thead>
                {/* Top Headers */}
                <tr>
                    <th rowSpan={3} className="border border-black p-2 bg-gray-100 font-bold text-sm align-middle">{t('ageGroup')}</th>
                    <th colSpan={3} className="border border-black p-2 font-bold bg-white">{t('surveyedChildren')}</th>
                    <th colSpan={15} className="border border-black p-2 font-bold bg-white">{t('admittedChildren')}</th>
                    <th colSpan={3} rowSpan={2} className="border border-black p-2 font-bold bg-gray-50 align-middle">{t('totalAdmitted')}</th>
                </tr>
                <tr>
                     {/* Surveyed Cols */}
                    <th className="border border-black p-1 w-10 bg-white">{t('boy')}</th>
                    <th className="border border-black p-1 w-10 bg-white">{t('girl')}</th>
                    <th className="border border-black p-1 w-10 bg-gray-200">{t('total')}</th>

                    {/* Classes Cols */}
                    {[ClassLevel.One, ClassLevel.Two, ClassLevel.Three, ClassLevel.Four, ClassLevel.Five].map(c => (
                        <th key={c} colSpan={3} className="border border-black p-1 font-semibold bg-gray-50">Class {c}</th>
                    ))}
                </tr>
                <tr>
                    {/* Empty cells for survey subheader alignment */}
                    <th className="border border-black p-1 bg-white">B</th>
                    <th className="border border-black p-1 bg-white">G</th>
                    <th className="border border-black p-1 bg-gray-200">T</th>

                    {/* Class Subheaders B/G/T x 5 */}
                    {[1, 2, 3, 4, 5].map(i => (
                        <React.Fragment key={i}>
                            <th className="border border-black p-1 bg-white">B</th>
                            <th className="border border-black p-1 bg-white">G</th>
                            <th className="border border-black p-1 bg-gray-100">T</th>
                        </React.Fragment>
                    ))}
                    
                    {/* Grand Total Subheader */}
                    <th className="border border-black p-1 bg-white">B</th>
                    <th className="border border-black p-1 bg-white">G</th>
                    <th className="border border-black p-1 bg-gray-200">{t('total')}</th>
                </tr>
            </thead>
            <tbody>
                {AGE_GROUPS.map(age => {
                    const boysTotal = getCount(age, Gender.Male);
                    const girlsTotal = getCount(age, Gender.Female);

                    return (
                        <tr key={age} className="hover:bg-gray-50">
                            <td className="border border-black p-2 font-bold bg-gray-50">{age}</td>
                            
                            {/* Surveyed Columns */}
                            <td className="border border-black p-1">{boysTotal}</td>
                            <td className="border border-black p-1">{girlsTotal}</td>
                            <td className="border border-black p-1 bg-gray-100 font-bold">{boysTotal + girlsTotal}</td>

                            {/* Class Columns */}
                            {[ClassLevel.One, ClassLevel.Two, ClassLevel.Three, ClassLevel.Four, ClassLevel.Five].map(cls => {
                                const b = getCount(age, Gender.Male, cls);
                                const g = getCount(age, Gender.Female, cls);
                                return (
                                    <React.Fragment key={cls}>
                                        <td className="border border-black p-1 text-gray-600">{b || '-'}</td>
                                        <td className="border border-black p-1 text-gray-600">{g || '-'}</td>
                                        <td className="border border-black p-1 bg-gray-50 font-bold text-black">{b + g || '-'}</td>
                                    </React.Fragment>
                                );
                            })}

                            {/* Row Totals */}
                            <td className="border border-black p-1 font-medium">{boysTotal}</td>
                            <td className="border border-black p-1 font-medium">{girlsTotal}</td>
                            <td className="border border-black p-1 font-bold bg-gray-100">{boysTotal + girlsTotal}</td>
                        </tr>
                    );
                })}

                {/* Footer Totals Row */}
                <tr className="bg-gray-200 font-bold print:bg-gray-200">
                    <td className="border border-black p-2 text-left pl-4 bg-gray-200">{t('grandTotal')}</td>
                    
                    {/* Surveyed Totals */}
                    <td className="border border-black p-1 bg-gray-200">{getTotal(Gender.Male)}</td>
                    <td className="border border-black p-1 bg-gray-200">{getTotal(Gender.Female)}</td>
                    <td className="border border-black p-1 bg-gray-200">{getTotal()}</td>

                    {/* Class Totals */}
                     {[ClassLevel.One, ClassLevel.Two, ClassLevel.Three, ClassLevel.Four, ClassLevel.Five].map(cls => {
                        const b = getTotal(Gender.Male, cls);
                        const g = getTotal(Gender.Female, cls);
                        return (
                            <React.Fragment key={cls}>
                                <td className="border border-black p-1 bg-gray-200">{b}</td>
                                <td className="border border-black p-1 bg-gray-200">{g}</td>
                                <td className="border border-black p-1 bg-gray-200">{b + g}</td>
                            </React.Fragment>
                        );
                    })}

                    {/* Grand Totals */}
                    <td className="border border-black p-1 bg-gray-200">{getTotal(Gender.Male)}</td>
                    <td className="border border-black p-1 bg-gray-200">{getTotal(Gender.Female)}</td>
                    <td className="border border-black p-1 text-base bg-gray-200">{getTotal()}</td>
                </tr>
            </tbody>
          </table>
        </div>

        {/* Signature Area */}
        <div className="mt-16 flex justify-between items-end print:flex px-8">
            <div className="text-center">
                <div className="border-t border-black w-48 mb-2"></div>
                <p className="font-bold">{t('surveyorSig')}</p>
            </div>
            <div className="text-center">
                <div className="border-t border-black w-48 mb-2"></div>
                <p className="font-bold">{t('headmasterSig')}</p>
                <p className="text-sm">{t('schoolName')}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Report;