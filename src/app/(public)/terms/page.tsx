import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "პირობები",
  description: "DekaByte-ის მომსახურების პირობები ციფრული სტუდიის სერვისებისთვის.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        მომსახურების პირობები
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        ბოლო განახლება: 2026 წლის აგვისტო
      </p>

      <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed text-muted-foreground">
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            1. მომსახურება
          </h2>
          <p>
            DekaByte გთავაზობთ ციფრული პროდუქტების შემუშავებას: ვებსაიტებს, Web
            Applications-ს, ადმინისტრირების სისტემებს, UI/UX დიზაინსა და Android
            აპლიკაციებს. კონკრეტული სამუშაოს მოცულობა, ვადები და ღირებულება
            განისაზღვრება ინდივიდუალური შეთანხმებით.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            2. ბიუჯეტის კალკულატორი
          </h2>
          <p>
            საიტზე არსებული ბიუჯეტის კალკულატორი აჩვენებს მხოლოდ საწყის
            სავარაუდო დიაპაზონს. ის არ წარმოადგენს საბოლოო შეთავაზებას ან
            ხელშეკრულებას. საბოლოო ღირებულება და ვადა ზუსტდება პროექტის
            დეტალური განხილვის შემდეგ.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            3. მოთხოვნები და კომუნიკაცია
          </h2>
          <p>
            კონტაქტის ფორმით გაგზავნილი შეტყობინება არის მოთხოვნა კომუნიკაციაზე
            და არ ქმნის ავტომატურ ვალდებულებას პროექტის შესრულებაზე. პასუხს
            ვცემთ მითითებული საკონტაქტო მონაცემებით, რაც შეიძლება პრაქტიკულად
            მალე.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            4. ინტელექტუალური საკუთრება
          </h2>
          <p>
            სანამ სხვა რამ არ იქნება წერილობით შეთანხმებული, პროექტის
            შედეგების (კოდი, დიზაინი, მასალები) გადაცემის პირობები ფიქსირდება
            კონკრეტულ ხელშეკრულებაში ან შეთავაზებაში. საიტის კონტენტი და
            ბრენდინგი ეკუთვნის DekaByte-ს, თუ სხვა რამ არ არის მითითებული.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            5. კლიენტის მასალები
          </h2>
          <p>
            თუ გვაწვდით ტექსტს, ლოგოს, ფოტოებს ან სხვა მასალას, ადასტურებთ, რომ
            გაქვთ მათი გამოყენების უფლება. უკანონო ან მესამე მხარის უფლებების
            დამრღვევი მასალის გამოყენებაზე პასუხისმგებლობა კლიენტს ეკისრება.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            6. პასუხისმგებლობის შეზღუდვა
          </h2>
          <p>
            საიტი მოწოდებულია „როგორც არის“ საინფორმაციო მიზნით. არ ვიძლევით
            გარანტიას, რომ საიტი უწყვეტად ან შეცდომების გარეშე იმუშავებს.
            პროექტის შესრულების პირობები რეგულირდება ცალკე შეთანხმებით.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            7. კონფიდენციალურობა
          </h2>
          <p>
            პირადი მონაცემების დამუშავება აღწერილია{" "}
            <Link
              href="/privacy"
              className="text-foreground underline-offset-4 hover:underline"
            >
              კონფიდენციალურობის პოლიტიკაში
            </Link>
            .
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-foreground">
            8. კონტაქტი
          </h2>
          <p>
            კითხვებისთვის გამოიყენეთ{" "}
            <Link
              href="/contact"
              className="text-foreground underline-offset-4 hover:underline"
            >
              კონტაქტის გვერდი
            </Link>{" "}
            ან საიტზე მითითებული საკონტაქტო საშუალებები.
          </p>
        </section>
      </div>
    </div>
  );
}
