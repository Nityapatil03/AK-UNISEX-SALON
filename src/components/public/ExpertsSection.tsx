import React from 'react';
import { Star, Award, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { Staff } from '../../types';

interface ExpertsSectionProps {
  staff: Staff[];
  onSelectExpert: (expert: Staff) => void;
}

export const ExpertsSection: React.FC<ExpertsSectionProps> = ({ staff, onSelectExpert }) => {
  return (
    <section id="experts" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Master Artisans &amp; Specialists
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet Our World-Class Creative Team
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Handpicked specialists certified by premier academies across London, Paris, and Mumbai. 
            Select your preferred artisan for personalized attention and consultation.
          </p>
        </div>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staff.filter(s => s.active).map((member) => (
            <div
              key={member.id}
              className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Experience Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{member.experienceYears}+ Yrs Exp</span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 border border-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{member.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400">({member.reviewsCount})</span>
                  </div>

                  {/* Name & Title Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold font-serif-luxury">{member.name}</h3>
                    <p className="text-xs text-rose-300 font-medium">{member.role}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  {/* Specializations Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialization.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Working status */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Available Today
                    </span>
                    <span>Hours: {member.workingHours.start} - {member.workingHours.end}</span>
                  </div>
                </div>
              </div>

              {/* Book with this expert CTA */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectExpert(member)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0b132b] to-[#1e293b] hover:from-rose-600 hover:to-rose-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span>Book with {member.name.split(' ')[0]}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
