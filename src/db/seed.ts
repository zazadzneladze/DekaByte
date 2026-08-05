import { config } from "dotenv";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "./index";
import { adminUsers, projects, siteSettings } from "./schema";
import { siteDefaults } from "../config/site";

config({ path: ".env.local" });
config({ path: ".env" });

const seedProjects = [
  {
    title: "Pop-Up",
    slug: "pop-up",
    category: "web_apps" as const,
    shortDescription:
      "სწრაფი კვების ბიზნესისთვის შექმნილი ციფრული პლატფორმა ონლაინ მენიუთი, შეკვეთების მიღებითა და თანამშრომლების სამუშაო პანელებით.",
    overview:
      "Pop-Up არის სწრაფი კვების რესტორნების ქსელისთვის შექმნილი სრულყოფილი ციფრული ეკოსისტემა. სისტემა აერთიანებს მომხმარებლებისთვის განკუთვნილ ონლაინ მენიუს, საიდანაც შესაძლებელია კერძების შეკვეთა და გადახდა, და თანამშრომლების მენეჯმენტის პანელს, სადაც რეალურ დროში ხდება შეკვეთების მიღება, სტატუსების მართვა და სამზარეულოს პროცესების კონტროლი.",
    challenge:
      "რესტორანში შეკვეთების მიღების პროცესის ავტომატიზაცია, რიგების შემცირება და მომხმარებლისთვის გამარტივებული ონლაინ გამოცდილების შექმნა.",
    solution: [
      "მომხმარებლის ინტერფეისი ონლაინ მენიუთი და სწრაფი შეკვეთით",
      "ადმინისტრატორის მართვის პანელი შეკვეთების მონიტორინგისთვის",
      "რეალურ დროში განახლებადი შეტყობინებების სისტემა სამზარეულოსთვის",
      "გადახდების ინტეგრაცია და გაყიდვების სტატისტიკის მოდული",
    ].join("\n"),
    features: [
      "სწრაფი და ინტუიციური მობილური ინტერფეისი",
      "რეალურ დროში შეკვეთების სინქრონიზაცია",
      "პროდუქტების კატეგორიების და ფასების მოქნილი მართვა",
      "ავტომატური QR-მენიუს გენერატორი მაგიდებისთვის",
    ],
    technologies: ["React", "TypeScript", "Supabase", "Vercel"],
    sortOrder: 10,
  },
  {
    title: "Batumi Design Lab",
    slug: "batumi-design-lab",
    category: "websites" as const,
    shortDescription:
      "არქიტექტურისა და ინტერიერის დიზაინის სტუდიის ვებსაიტი მომსახურებებით, პროექტების პორტფოლიოთი და ინტერიერის ღირებულების კალკულატორით.",
    overview:
      "Batumi Design Lab-ისთვის შექმნილი ვებსაიტი წარმოადგენს პრემიუმ კლასის ციფრულ პორტფოლიოს. საიტზე წარმოდგენილია დასრულებული არქიტექტურული პროექტები, დეტალური მომსახურებების აღწერები და უნიკალური ინტერაქტიული კალკულატორი.",
    challenge:
      "დიზაინ სტუდიის პრემიუმ იმიჯის ციფრულ სივრცეში გადმოტანა და კალკულატორის მეშვეობით პოტენციური კლიენტებისგან ხარისხიანი მოთხოვნების გენერირება.",
    solution: [
      "პორტფოლიოს მაღალი ხარისხის გალერეა ფილტრაციით",
      "ინტერაქტიული დიზაინის ღირებულების კალკულატორი",
      "მომსახურების პაკეტების და ფასების შედარების სექცია",
      "საკონტაქტო და კონსულტაციის დაჯავშნის ფორმა",
    ].join("\n"),
    features: [
      "მინიმალისტური და ელეგანტური ვიზუალური სტილი",
      "ინტერიერის კალკულატორი მყისიერი გამოთვლით",
      "სურათების ზუმი და მოსახერხებელი სლაიდერი",
      "ოპტიმიზებული მაღალი რეზოლუციის ფოტოების ჩატვირთვა",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Motion"],
    sortOrder: 20,
  },
  {
    title: "GBP",
    slug: "gbp",
    category: "websites" as const,
    shortDescription:
      "მშობლებისთვის გასაგები და მეგობრული საინფორმაციო ვებსაიტი საბავშვო ბაღის პროგრამების, გარემოსა და სიახლეების წარმოსაჩენად.",
    overview:
      "GBP საბავშვო ბაღის ვებსაიტი შეიქმნა მშობლებსა და ბაღის ადმინისტრაციას შორის კომუნიკაციის გასამარტივებლად. საიტი აერთიანებს ინფორმაციას საგანმანათლებლო პროგრამებზე, ყოველდღიურ განრიგზე, კვების მენიუზე, ინფრასტრუქტურასა და რეგისტრაციის პროცედურებზე.",
    challenge:
      "მშობლებისთვის სრულყოფილი ინფორმაციის მიწოდება და ბაღში ახალი აღსაზრდელების ონლაინ რეგისტრაციის პროცესის გამარტივება.",
    solution: [
      "ფერადი და თბილი დიზაინის საინფორმაციო პლატფორმა",
      "საგანმანათლებლო პროგრამების და განრიგების ინტერაქტიული ბლოკები",
      "ყოველდღიური მენიუს და აქტივობების კალენდარი",
      "რეგისტრაციის და დოკუმენტების ატვირთვის ონლაინ ფორმა",
    ].join("\n"),
    features: [
      "მშობლებზე ორიენტირებული ნავიგაცია",
      "სიახლეებისა და ბლოგის მოდული",
      "ფოტო და ვიდეო გალერეა ბაღის გარემოს საჩვენებლად",
      "სრულად ადაპტირებული ნებისმიერ ეკრანზე",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    sortOrder: 30,
  },
  {
    title: "ხარჯთაღრიცხვის სისტემა",
    slug: "cost-estimator",
    category: "web_apps" as const,
    shortDescription:
      "სამშენებლო და სარემონტო სამუშაოების ღირებულების დასათვლელად შექმნილი ციფრული ინსტრუმენტი.",
    overview:
      "სპეციალიზებული ვებ-აპლიკაცია სამშენებლო და სარემონტო კომპანიებისთვის, რომელიც ავტომატურად ითვლის მასალების, სამუშაო ძალისა და დამატებითი ხარჯების მოცულობას.",
    challenge:
      "სამშენებლო კომპანიებისთვის ხარჯთაღრიცხვის შედგენის ხელით მუშაობის პროცესის ჩანაცვლება სწრაფი და შეცდომებისგან დაცული ციფრული სისტემით.",
    solution: [
      "ინტერაქტიული პარამეტრების შესაყვანი ფორმა",
      "ავტომატური გაანგარიშების ალგორითმი და ფასების ბაზა",
      "დეტალური PDF ანგარიშების გენერატორი",
      "მომხმარებლის პირადი სამუშაო დაფა შენახული პროექტებით",
    ].join("\n"),
    features: [
      "ფასების დინამიური კორექტირება ბაზრის მიხედვით",
      "მარტივი და სუფთა ცხრილები მონაცემთა სანახავად",
      "მყისიერი შედეგები ინტერაქტიული გრაფიკებით",
      "მოწყობილობის ეკრანებზე მორგებული სამუშაო სივრცე",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "PDF Export"],
    sortOrder: 40,
  },
  {
    title: "Render Prompt Generator",
    slug: "render-prompt",
    category: "ai_tools" as const,
    shortDescription:
      "არქიტექტურული და ინტერიერის ვიზუალიზაციისთვის დეტალური AI პრომტების შექმნის ინსტრუმენტი.",
    overview:
      "Render Prompt Generator არის ინსტრუმენტი არქიტექტორებისა და ინტერიერის დიზაინერებისთვის. მომხმარებელი ირჩევს ოთახის ტიპს, სტილს, განათებას, მასალებსა და ფერებს, ხოლო სისტემა აგენერირებს ოპტიმიზებულ პრომტებს რენდერებისთვის.",
    challenge:
      "დიზაინერებისთვის რენდერინგის პროცესის გამარტივება და AI ხელსაწყოებისგან უკეთესი ვიზუალური შედეგების მიღება.",
    solution: [
      "პარამეტრების შერჩევის ინტერაქტიული პანელი",
      "პრომტების გენერატორი სპეციალური ტეგებით",
      "მარტივი კოპირების და შენახვის ფუნქციონალი",
      "მზა რენდერების და შესაბამისი პრომტების შთაგონების გალერეა",
    ].join("\n"),
    features: [
      "წამიერი გენერირება",
      "მრავალფეროვანი წინასწარ გამზადებული სტილები და განათებები",
      "სუფთა, მინიმალისტური ბნელი რეჟიმის ინტერფეისი",
      "მსუბუქი და სწრაფი ჩატვირთვა",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Local Storage"],
    sortOrder: 50,
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD are required for seeding");
  }
  if (password.length < 10) {
    throw new Error("ADMIN_INITIAL_PASSWORD must be at least 10 characters");
  }

  const db = getDb();

  await db
    .insert(siteSettings)
    .values({
      id: 1,
      brandName: siteDefaults.brandName,
      phoneDisplay: siteDefaults.phoneDisplay,
      phoneE164: siteDefaults.phoneE164,
      whatsappNumber: siteDefaults.whatsappNumber,
      email: siteDefaults.email,
      facebookUrl: "",
      messengerUrl: "",
      instagramUrl: "",
      linkedinUrl: "",
      githubUrl: "",
      defaultSeoTitle: siteDefaults.defaultSeoTitle,
      defaultSeoDescription: siteDefaults.defaultSeoDescription,
    })
    .onConflictDoUpdate({
      target: siteSettings.id,
      set: {
        brandName: siteDefaults.brandName,
        phoneDisplay: siteDefaults.phoneDisplay,
        phoneE164: siteDefaults.phoneE164,
        whatsappNumber: siteDefaults.whatsappNumber,
        email: siteDefaults.email,
        defaultSeoTitle: siteDefaults.defaultSeoTitle,
        defaultSeoDescription: siteDefaults.defaultSeoDescription,
        updatedAt: new Date(),
      },
    });

  const passwordHash = await hash(password, 12);
  const existingAdmin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email.toLowerCase()),
  });
  if (!existingAdmin) {
    await db.insert(adminUsers).values({
      email: email.toLowerCase(),
      passwordHash,
      isActive: true,
    });
  }

  for (const project of seedProjects) {
    const existing = await db.query.projects.findFirst({
      where: eq(projects.slug, project.slug),
    });
    if (existing) continue;
    await db.insert(projects).values({
      ...project,
      status: "draft",
      featured: false,
    });
  }

  console.log("Seed completed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
