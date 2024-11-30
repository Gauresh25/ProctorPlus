import { Link } from "react-router-dom";

const SkillTests = () => {
  const tests = [
    {
      title: "UI/UX Design Fundamentals",
      description: "Essential design principles and tools for aspiring UI/UX designers.",
      domain: "design"
    },
    {
      title: "Product Design & Prototyping",
      description: "Create interactive prototypes and learn advanced design systems.",
      domain: "design"  
    },
    {
      title: "Enterprise UX Architecture",
      description: "Complex design challenges and enterprise-scale design systems.",
      domain: "design"
    },
    {
      title: "Digital Marketing Essentials",
      description: "Master the foundations of modern digital marketing.",
      domain: "marketing"
    },
    {
      title: "Growth Marketing & Analytics", 
      description: "Data-driven marketing strategies and campaign optimization.",
      domain: "marketing"
    },
    {
      title: "Strategic Brand Marketing",
      description: "Advanced brand strategy and integrated marketing campaigns.",
      domain: "marketing"
    },
    {
      title: "Computer Science Foundations",
      description: "Problem solving and computer science basics using Python.",
      domain: "coding"
    },
    {
      title: "Machine Learning Engineering",
      description: "Build and deploy machine learning models at scale.",
      domain: "coding"
    },
    {
      title: "Backend Engineering  with Node.js",
      description: "Server-side development and API architecture using Node.js.",
      domain: "coding"
    },
  ];

  return (
    <div>
      <header className="navbar">
        <Link to="/" className="logo">
          ProctorPlus
        </Link>
        <nav className="nav-links">
          <Link to="/test">Our tests</Link>
          <a href="#certification">Domains</a>
          <a href="#languages">About Us</a>
          <a href="#languages">Contact Us</a>
        </nav>
        <div className="auth-buttons">
          <a href="/auth">
            <button className="login">Log in</button>
          </a>
          <button className="signup">Sign up</button>
        </div>
      </header>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
        <h1 className="text-4xl font-bold text-teal-600 mb-8">Our Tests</h1>
        <div className="w-11/12 md:w-10/12 lg:w-8/12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 text-gray-700 p-6 rounded-lg shadow-md flex flex-col justify-between"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {test.title}
                </h2>
                <p className="mt-2 text-sm">{test.description}</p>
                <div className="mt-4 flex justify-between">
                  <Link
                    to={`/exam`}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded shadow"
                  >
                    Start Test
                  </Link>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTests;
