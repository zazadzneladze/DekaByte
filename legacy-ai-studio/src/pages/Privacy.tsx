import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Lock, FileText } from "lucide-react";
import { siteConfig } from "../data/site";

export function Privacy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Back Link Button */}
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white text-sm font-semibold mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>მთავარზე დაბრუნება</span>
        </Link>

        {/* Header Icon */}
        <div className="flex items-center space-x-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-zinc-950 dark:text-white">
              კონფიდენციალურობის პოლიტიკა
            </h1>
            <p className="text-xs text-zinc-400 font-mono tracking-wider uppercase mt-1">
              ბოლო განახლება: 2026 წლის ივლისი
            </p>
          </div>
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-8 text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed font-sans">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-850/50 flex items-start space-x-3 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            <Lock className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
            <p>
              ეს დოკუმენტი არეგულირებს {siteConfig.companyName}-ის მიერ ვებსაიტის მომხმარებელთა პერსონალური მონაცემების დამუშავების წესებსა და პირობებს. ჩვენი მიზანია დავიცვათ თქვენი უსაფრთხოება.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center">
              1. რა მონაცემებს ვაგროვებთ?
            </h3>
            <p>
              ჩვენი ვებსაიტი არ ითხოვს სავალდებულო რეგისტრაციას ან ავტორიზაციას. ერთადერთი შემთხვევა, როდესაც თქვენ გვიზიარებთ პერსონალურ ინფორმაციას, არის საინფორმაციო ფორმის შევსება პროექტის შეფასების მისაღებად. ეს ინფორმაცია მოიცავს:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>სახელი და გვარი</li>
              <li>საკონტაქტო ინფორმაცია (ტელეფონის ნომერი ან ელფოსტა)</li>
              <li>ინფორმაცია მოთხოვნილი პროექტის შესახებ</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center">
              2. მონაცემთა დამუშავება და უსაფრთხოება
            </h3>
            <p>
              ვებსაიტზე შევსებული საინფორმაციო ფორმა მუშავდება სრულად კლიენტ-სერვერული უსაფრთხოების წესებით. ინფორმაცია არ ინახება მესამე მხარის მონაცემთა ბაზებში. ფორმაზე დაჭერისას თქვენს მიერ შეყვანილი მონაცემები უშუალოდ გადაიცემა ჩვენს ოფიციალურ საკონტაქტო არხზე (WhatsApp API ან default ელფოსტის აპლიკაცია), სადაც კომუნიკაცია დაცულია დაშიფვრის თანამედროვე სტანდარტებით.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center">
              3. ქუქი (Cookie) ფაილების გამოყენება
            </h3>
            <p>
              ვებსაიტის გამართული ფუნქციონირებისთვის, დიზაინის რეჟიმების (Light/Dark რეჟიმი) დასამახსოვრებლად და ზოგადი ვიზუალური ეფექტების ოპტიმიზაციისთვის, საიტი იყენებს ბრაუზერის ლოკალურ მეხსიერებას (Local Storage) და ქუქი ფაილებს. ქუქი ფაილები არ გამოიყენება მომხმარებელთა ქცევაზე ფარული თვალთვალის ან სარეკლამო მიზნებისთვის.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center">
              4. მესამე მხარეებთან ინფორმაციის გაზიარება
            </h3>
            <p>
              {siteConfig.companyName} არასოდეს ყიდის, არ ასესხებს და არ გადასცემს მომხმარებელთა პირად მონაცემებს მესამე პირებს, გარდა საქართველოს კანონმდებლობით მკაცრად გათვალისწინებული შემთხვევებისა.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center">
              5. თქვენი უფლებები
            </h3>
            <p>
              თქვენ ნებისმიერ დროს გაქვთ უფლება მოითხოვოთ ჩვენთან არსებული თქვენი საკონტაქტო ინფორმაციის წაშლა ან განახლება. ამისათვის შეგიძლიათ უბრალოდ მოგვწეროთ ელფოსტაზე: <a href={`mailto:${siteConfig.email}`} className="text-zinc-900 dark:text-white underline font-medium">{siteConfig.email}</a>.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center">
              6. ცვლილებები პოლიტიკაში
            </h3>
            <p>
              კონფიდენციალურობის პოლიტიკაში ცვლილების შეტანის უფლებას ვიტოვებთ ვებსაიტის განახლებების შესაბამისად. ნებისმიერი ცვლილება მყისიერად აისახება ამავე გვერდზე.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
