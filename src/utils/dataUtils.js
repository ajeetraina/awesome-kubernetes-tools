/**
 * Functions to fetch and process Kubernetes tools data
 */

// Placeholder function for fetching tools
// In production, this would fetch from an API or JSON file
export const fetchTools = async () => {
  // For demo purposes, we'll return mock data
  // In production, you'd fetch from an API or parse your README.md
  // const response = await fetch('/api/tools');
  // return response.json();
  
  return generateSampleData();
};

// Function to parse GitHub Markdown table into structured data
// This could be used in a build step to convert your README.md to JSON
export const parseMarkdownTable = (markdown) => {
  const lines = markdown.split('\n');
  const tools = [];
  let currentCategory = '';
  let id = 1;
  
  for (const line of lines) {
    // Check for category headers (## Category Name)
    if (line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim();
      continue;
    }
    
    // Check for table rows
    if (line.startsWith('|') && line.includes('|') && !line.includes('---')) {
      // Skip table headers
      if (line.includes('Sr No') || line.includes('Tool Name') || line.includes('Description')) {
        continue;
      }
      
      // Parse table row
      const columns = line.split('|').filter(col => col.trim());
      if (columns.length >= 4) {
        // Extract data from columns
        const name = columns[1].trim();
        let description = '';
        let url = '';
        
        // Extract URL and description from markdown link format [Description](URL)
        const descColumn = columns[2].trim();
        const linkMatch = descColumn.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          description = linkMatch[1].trim();
          url = linkMatch[2].trim();
        } else {
          description = descColumn;
        }
        
        // Extract star count from GitHub badge
        let stars = 0;
        const starsColumn = columns[3].trim();
        const starsMatch = starsColumn.match(/\/stars\/(.*?)\)/);
        if (starsMatch) {
          // Would need an API call to get actual stars count
          // For now, generate a random number
          stars = Math.floor(Math.random() * 20000);
        }
        
        tools.push({
          id: id++,
          name,
          description,
          url,
          category: currentCategory,
          stars
        });
      }
    }
  }
  
  return tools;
};

// Generate sample data for development
const generateSampleData = () => {
  return [
    {
      id: 1,
      name: "Monokle",
      category: "Cluster Management",
      description: "Desktop unified visual tool for authoring, analysis and deployment of Kubernetes configurations",
      url: "https://github.com/kubeshop/monokle",
      stars: 2400
    },
    {
      id: 2,
      name: "kops",
      category: "Cluster Management",
      description: "Production Grade K8s Installation, Upgrades, and Management",
      url: "https://github.com/kubernetes/kops",
      stars: 14800
    },
    {
      id: 3,
      name: "kubetail",
      category: "Pods",
      description: "Bash script to tail Kubernetes logs from multiple pods at the same time",
      url: "https://github.com/johanhaleby/kubetail",
      stars: 3200
    },
    {
      id: 4,
      name: "Helm",
      category: "Package Management",
      description: "The Kubernetes Package Manager",
      url: "https://github.com/helm/helm",
      stars: 23500
    },
    {
      id: 5,
      name: "Prometheus",
      category: "Alert and Monitoring",
      description: "The Prometheus monitoring system and time series database",
      url: "https://github.com/prometheus/prometheus",
      stars: 47000
    },
    {
      id: 6,
      name: "Grafana",
      category: "Alert and Monitoring",
      description: "The tool for beautiful monitoring and metric analytics & dashboards",
      url: "https://github.com/grafana/grafana",
      stars: 54600
    },
    {
      id: 7,
      name: "kind",
      category: "Cluster with Core CLI tools",
      description: "Kubernetes IN Docker - local clusters for testing Kubernetes",
      url: "https://github.com/kubernetes-sigs/kind",
      stars: 11200
    },
    {
      id: 8,
      name: "Jaeger",
      category: "Logging and Tracing",
      description: "CNCF Jaeger, a Distributed Tracing Platform",
      url: "https://github.com/jaegertracing/jaeger",
      stars: 16800
    },
    {
      id: 9,
      name: "Kubeview",
      category: "Cluster with Core CLI tools",
      description: "Kubernetes cluster visualiser and graphical explorer",
      url: "https://github.com/benc-uk/kubeview",
      stars: 975
    },
    {
      id: 10,
      name: "Okteto",
      category: "Developement Tools/Kit",
      description: "Build better applications by developing and testing your code directly in Kubernetes",
      url: "https://github.com/okteto/okteto",
      stars: 4600
    },
    {
      id: 11,
      name: "Argo CD",
      category: "CI/CD integration Tools",
      description: "Declarative continuous deployment for Kubernetes",
      url: "https://github.com/argoproj/argo-cd",
      stars: 13400
    },
    {
      id: 12,
      name: "Tekton",
      category: "CI/CD integration Tools",
      description: "A cloud native continuous integration and delivery (CI/CD) solution",
      url: "https://github.com/tektoncd/pipeline",
      stars: 7800
    },
    {
      id: 13,
      name: "Calico",
      category: "Network Policies",
      description: "Cloud native connectivity and network policy",
      url: "https://github.com/projectcalico/calico",
      stars: 4700
    },
    {
      id: 14,
      name: "Kubevious CLI",
      category: "Security Tools",
      description: "Prevent cross-manifest errors and violations of best practices in YAML files, Helm Charts and Kubernetes clusters",
      url: "https://github.com/kubevious/cli",
      stars: 1100
    },
    {
      id: 15,
      name: "TerraScanner",
      category: "Security Tools",
      description: "Detect compliance and security violations across Infrastructure as Code to mitigate risk before provisioning cloud native infrastructure",
      url: "https://github.com/accurics/terrascan",
      stars: 4200
    },
    {
      id: 16,
      name: "PowerfulSeal",
      category: "Troubleshooting / Debugging",
      description: "A powerful testing tool for Kubernetes clusters",
      url: "https://github.com/bloomberg/powerfulseal",
      stars: 2600
    },
    {
      id: 17,
      name: "K9s",
      category: "Cluster with Core CLI tools",
      description: "Kubernetes CLI To Manage Your Clusters In Style!",
      url: "https://github.com/derailed/k9s",
      stars: 19800
    },
    {
      id: 18,
      name: "Lens",
      category: "Developement Tools/Kit",
      description: "A powerful interface and toolkit for managing, visualizing, and interacting with multiple Kubernetes clusters",
      url: "https://k8slens.dev/",
      stars: 20300
    },
    {
      id: 19,
      name: "Minikube",
      category: "Alternative Tools for Development",
      description: "minikube implements a local Kubernetes cluster",
      url: "https://github.com/kubernetes/minikube",
      stars: 26700
    },
    {
      id: 20,
      name: "KubeArchInspect",
      category: "Cluster Management",
      description: "Kubernetes Architecture Inspection Tool",
      url: "https://github.com/ArmDeveloperEcosystem/kubearchinspect",
      stars: 520
    },
    // Add more tools as needed
  ];
};

// Add a function to parse actual GitHub markdown table in the future
