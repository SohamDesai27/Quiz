const self = {};

const starterCode = "public class SumArgs {\n" +
    "\n" +
    "   public static void main(String[] args) {\n" +
    "       \n" +
    "   }\n" +
    "}\n" +
    "";

const completeSolution = "public class SumArgs {\n" +
    "\n" +
    "   public static void main(String[] args) {\n" +
    "       // @1\n" +
    "       int sum = 0;\n" +
    "       for (int i=0; i<args.length; i++) sum += Integer.parseInt(args[i]);\n" +
    "       System.out.println(sum);\n" +
    "       // @1\n" +
    "   }\n" +
    "}\n" +
    "";

const goodUserCode =
    "       int sum = 0;\n" +
    "       for (int i=0; i<args.length; i++) sum += Integer.parseInt(args[i]);\n" +
    "       System.out.println(sum);\n" +
    "";

const goodSplicedCode =
    "public class SumArgs {\n" +
    "\n" +
    "   public static void main(String[] args) {\n" +
    "       // @1\n" +
    "       int sum = 0;\n" +
    "       for (int i=0; i<args.length; i++) sum += Integer.parseInt(args[i]);\n" +
    "       System.out.println(sum);\n" +
    "\n// @1\n" +
    "   }\n" +
    "}\n" +
    "";

const testCases = [
    {
        input: '3 4 < input.txt',
        public: true
    },
    {
        input: '11 9',
        public: false
    },
    {
        input: '200 30',
        public: false
    },
    {
        input: '132 4931',
        public: false
    }
];

const inputFiles = [
    {
        name: "input.txt",
        contents: "1 2 3 4"
    }
];

self.singleQuestion = {
    _id: "58bb4a97de9d8a5e38ee75c4",
    title: "Title",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ultrices dolor sed nunc posuere commodo. " +
    "Aenean hendrerit felis a sapien maximus aliquam. Integer venenatis ipsum dolor, id gravida urna porta cursus. " +
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. " +
    "Sed hendrerit varius velit, et imperdiet elit faucibus a. Nulla facilisi. Nullam placerat tempor laoreet. " +
    "Cras blandit ligula at eros blandit, a mollis nibh hendrerit. Ut pretium vitae mauris in varius. " +
    "In hac habitasse platea dictumst. Integer quis faucibus massa. " +
    "Nam mattis eleifend dui, et lobortis sapien ullamcorper quis. Nam non ligula enim.",
    language: 'Java',
    topics: 'if statements, while loops, printf',
    difficulty: 'Medium',
    activeDate: new Date(),
    dueDate: new Date(),
    updatedAt: new Date(),
    starterCode: starterCode,
    className: "SumArgs",
    completeSolution: completeSolution,
    points: 15,
    testCases: testCases,
    inputFiles: inputFiles,
    goodUserCode: goodUserCode,
    goodSplicedCode: goodSplicedCode
};

module.exports = self;
