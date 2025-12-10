import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { studentService } from '../services/studentService';
import { Student, Gender, ClassLevel, AGE_GROUPS } from '../types';
import { Save, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const initialFormState: Partial<Student> = {
  childName: '',
  fatherName: '',
  motherName: '',
  ageGroup: '6+',
  gender: Gender.Male,
  class: ClassLevel.One,
  previousSchool: '',
  comesFromSchoolCoverageArea: true,
  comesFromOtherSchools: false,
  guardianPhone: '',
  notes: ''
};

const StudentForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Student>>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useAppContext();

  useEffect(() => {
    if (id) {
      setLoading(true);
      studentService.getStudentById(id).then(student => {
        if (student) {
          setFormData(student);
        } else {
          setError('Student not found');
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await studentService.updateStudent(id, formData);
      } else {
        await studentService.createStudent(formData as any);
      }
      navigate('/list');
    } catch (err) {
      setError('Failed to save student data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleReset = () => {
    if (!id) setFormData(initialFormState);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{id ? t('editStudent') : t('newAdmissionEntry')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('enterDetails')}</p>
        </div>
        <button 
          onClick={() => navigate('/list')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-4 h-4" /> {t('backToList')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        {/* Form Header */}
        <div className="bg-green-50 dark:bg-green-900/30 p-4 border-b border-green-100 dark:border-green-900/50 flex items-center justify-between">
            <span className="text-green-800 dark:text-green-400 font-semibold text-sm uppercase tracking-wide">
                {id ? `${t('serialNo')}: ${formData.serialNo}` : `${t('autoSerial')}`}
            </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 border-b dark:border-gray-700 pb-2">{t('studentInfo')}</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('childName')} *</label>
                <input
                  required
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('ageGroup')} *</label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {AGE_GROUPS.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('gender')} *</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={Gender.Male}
                      checked={formData.gender === Gender.Male}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{t('male')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={Gender.Female}
                      checked={formData.gender === Gender.Female}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{t('female')}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('classToAdmit')} *</label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {Object.values(ClassLevel).map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parent & Other Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 border-b dark:border-gray-700 pb-2">{t('familyInfo')}</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('fatherName')}</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('motherName')}</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('guardianPhone')}</label>
                <input
                  type="tel"
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('prevInst')}</label>
                <input
                  type="text"
                  name="previousSchool"
                  value={formData.previousSchool}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 border-b dark:border-gray-700 pb-2">{t('additionalInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                        type="checkbox"
                        name="comesFromSchoolCoverageArea"
                        checked={formData.comesFromSchoolCoverageArea}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{t('insideCoverage')}</span>
                </label>

                <label className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input
                        type="checkbox"
                        name="comesFromOtherSchools"
                        checked={formData.comesFromOtherSchools}
                        onChange={handleChange}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{t('fromOtherSchool')}</span>
                </label>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('notes')}</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none resize-none"
                />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-4">
             <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-2.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> {t('reset')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? t('saving') : <><Save className="w-4 h-4" /> {t('saveRecord')}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;