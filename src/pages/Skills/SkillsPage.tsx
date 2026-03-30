import { useState, useEffect } from "react";
import SkillModal from "../../components/portfolio/SkillModal";
import { portfolioService } from "../../services/portfolioService";
import type { Skill } from "../../types/skill";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { Plus, Trash2, Edit, Code2, AlertCircle } from "lucide-react";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getSkills();
      setSkills(response.skills || []);
    } catch (err: unknown) {
      setError("Failed to fetch skills. Ensure backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreate = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    console.log("Delete clicked for ID:", id);
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      console.log("Calling deleteSkill for ID:", id);
      const result = await portfolioService.deleteSkill(id);
      console.log("Delete result:", result);
      setSkills((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete skill.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Technical Skills
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage the programming languages, tools, and frameworks you know.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm font-medium transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Skill
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center shadow-sm font-medium text-sm">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {skills.length === 0 && !error ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No skills yet
          </h3>
          <p className="text-gray-500 mb-6">
            Show off your tech stack by adding your first skill.
          </p>
          <button
            onClick={handleCreate}
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            + Add a skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 border border-gray-200 p-6 flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover Actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 p-1 rounded-lg backdrop-blur-sm shadow-sm border border-gray-100">
                <button
                  onClick={() => handleEdit(skill)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="w-16 h-16 mb-4 flex items-center justify-center p-2 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <img
                  src={skill.skill_icon}
                  alt={skill.title}
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-3">
                {skill.title}
              </h3>

              <div className="flex flex-wrap justify-center gap-1.5 mt-auto">
                {skill.tags?.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-bold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <SkillModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          skill={selectedSkill}
          onSuccess={fetchSkills}
        />
      )}
    </div>
  );
}
