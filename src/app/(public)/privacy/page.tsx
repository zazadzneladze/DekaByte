import type { Metadata } from "next";
import Link from "next/link";

import { SectionLabel } from "@/components/public/section-label";

export const metadata: Metadata = {
  title: "კონფიდენციალურობა",
  description:
    "DekaByte-ის კონფიდენციალურობის პოლიტიკა — კონტაქტის მოთხოვნები და ანალიტიკური ქუქიები.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <SectionLabel>იურიდიული</SectionLabel>
      <h1 className="text-display text-3xl font-semibold text-foreground sm:text-5xl">
        კონფიდენციალურობის პოლიტიკა
      </h1>
      <p className="mt-4 text-sm text-muted-foreground">
        ბოლო განახლება: 2026 წლის აგვისტო
      </p>

      <div className="mt-12 flex flex-col gap-10 text-base leading-relaxed text-muted-foreground">
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            1. ვინ ვართ ჩვენ
          </h2>
          <p>
            ეს პოლიტიკა ეხება საიტს{" "}
            <Link href="/" className="text-foreground underline-offset-4 hover:underline">
              DekaByte
            </Link>
            — ციფრული პროდუქტების სტუდიას, რომელიც ქმნის ვებსაიტებს, Web
            Applications-ს, UI/UX დიზაინსა და Android აპლიკაციებს.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            2. რა მონაცემებს ვაგროვებთ
          </h2>
          <p>
            როცა ავსებთ კონტაქტის ფორმას, ვაგროვებთ თქვენ მიერ მითითებულ
            ინფორმაციას: სახელს, ტელეფონს და/ან ელფოსტას, პროექტის ტიპს,
            შეტყობინებას და (სურვილისამებრ) სასურველ საკონტაქტო საშუალებას.
          </p>
          <p>
            მოთხოვნები ინახება Neon Postgres მონაცემთა ბაზაში (leads), რათა
            შევძლოთ თქვენთან დაკავშირება და მოთხოვნის დამუშავება. დამატებით,
            სპამისა და ბოროტად გამოყენების შეზღუდვისთვის შეიძლება შენახული
            იყოს IP მისამართის ჰეში — არა თავად IP მისამართი ღია სახით.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            3. როგორ ვიყენებთ მონაცემებს
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>პროექტის მოთხოვნაზე პასუხის გასაცემად</li>
            <li>შეთავაზებისა და შემდგომი კომუნიკაციისთვის</li>
            <li>სერვისის უსაფრთხოებისა და ბოროტად გამოყენების პრევენციისთვის</li>
          </ul>
          <p>
            მონაცემებს არ ვყიდით და არ გადავცემთ მესამე მხარეებს მარკეტინგული
            მიზნით. წვდომა აქვთ მხოლოდ ადმინისტრაციულ მომხმარებლებს.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            4. Meta Pixel და ქუქიები
          </h2>
          <p>
            საიტზე შეიძლება ჩაიტვირთოს Meta (Facebook) Pixel ანალიტიკისთვის —
            მხოლოდ მას შემდეგ, რაც ქუქიების ბანერზე დაადასტურებთ თანხმობას.
            უარყოფის შემთხვევაში Pixel არ იტვირთება.
          </p>
          <p>
            თანხმობის შემდეგ Pixel შეიძლება აგროვებდეს აგრეგირებულ
            ქცევით/ტექნიკურ მონაცემებს (მაგ. გვერდის ნახვა, ღილაკზე დაკლიკება)
            საიტის გაუმჯობესებისთვის. კონტაქტის ფორმის პირად მონაცემებს
            (სახელი, ტელეფონი, ელფოსტა, შეტყობინება) Pixel-ში არ ვაგზავნით.
          </p>
          <p>
            თანხმობის არჩევანი ინახება თქვენს ბრაუზერში (localStorage). შეგიძლიათ
            მოგვიანებით წაშალოთ საიტის მონაცემები ბრაუზერის პარამეტრებიდან.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            5. შენახვის ვადა
          </h2>
          <p>
            კონტაქტის მოთხოვნები ინახება მანამ, სანამ საჭიროა კომუნიკაციისა და
            პროექტის განხილვისთვის, ან სანამ არ მოითხოვთ წაშლას — კანონით
            გათვალისწინებული ვალდებულებების გათვალისწინებით.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            6. თქვენი უფლებები
          </h2>
          <p>
            შეგიძლიათ მოითხოვოთ თქვენს შესახებ შენახული კონტაქტის მონაცემების
            ნახვა, შესწორება ან წაშლა. დაგვიკავშირდით{" "}
            <Link
              href="/contact"
              className="text-foreground underline-offset-4 hover:underline"
            >
              კონტაქტის გვერდიდან
            </Link>{" "}
            ან ელფოსტით, რომელიც მითითებულია საიტის ფუტერში.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            7. ცვლილებები
          </h2>
          <p>
            ამ პოლიტიკის განახლებისას თარიღს შევცვლით ამ გვერდზე. არსებითი
            ცვლილებების შემთხვევაში შევეცდებით საიტზე უფრო თვალსაჩინოდ
            მოვნიშნოთ.
          </p>
        </section>
      </div>
    </div>
  );
}
