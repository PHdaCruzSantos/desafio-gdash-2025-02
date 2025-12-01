export const TYPE_COLORS: Record<string, string> = {
  normal: "from-neutral-400 to-neutral-600",
  fire: "from-orange-500 to-red-600",
  water: "from-blue-400 to-blue-700",
  electric: "from-yellow-300 to-yellow-500",
  grass: "from-green-400 to-green-700",
  ice: "from-cyan-300 to-cyan-500",
  fighting: "from-red-600 to-red-900",
  poison: "from-purple-400 to-purple-700",
  ground: "from-amber-600 to-yellow-800",
  flying: "from-indigo-300 to-indigo-500",
  psychic: "from-pink-400 to-pink-700",
  bug: "from-lime-400 to-lime-700",
  rock: "from-stone-500 to-stone-700",
  ghost: "from-violet-600 to-violet-900",
  dragon: "from-indigo-500 to-purple-700",
  steel: "from-gray-400 to-slate-600",
  fairy: "from-rose-300 to-pink-500",
};

export const getTypeColor = (type?: string) => {
  return TYPE_COLORS[type?.toLowerCase() || "normal"] || TYPE_COLORS.normal;
};