export const SecurityPolicyPage = () => {
    return (
        <section className="col-span-3">
            <section className="space-y-5 my-5">
                <p>
                    We take the security and integrity of UltrasHub very seriously. If you have found a vulnerability,
                    please report it <abbr title="As Soon As Possible">ASAP</abbr> so we can quickly remediate the
                    issue.
                </p>
                <p>Table of Contents</p>
                <ul className="list-disc list-inside space-y-3 ml-10">
                    <li>
                        <a
                            href="#Vulnerability_Disclosure"
                            className="text-muted-foreground hover:text-current focus:text-current"
                        >
                            How to Disclose a Vulnerability
                        </a>
                    </li>
                    <li>
                        <a
                            href="#Submission_Guidelines"
                            className="text-muted-foreground hover:text-current focus:text-current"
                        >
                            Submission Guidelines
                        </a>
                    </li>
                </ul>
            </section>
            <section className="space-y-5 my-5">
                <h1 id="Vulnerability_Disclosure" className="text-3xl font-bold text-primary">
                    How to Disclose a Vulnerability
                </h1>
                <p>
                    For vulnerabilities that impact the confidentiality, integrity, and availability of UltrasHub
                    services, please send your disclosure via
                    <a
                        href="mailto:contact@ultrashub.io"
                        rel="noopener"
                        className="underline text-muted-foreground hover:text-current focus:text-current ml-1"
                    >
                        email
                    </a>{" "}
                    . For non-security related platform bugs, follow the bug submission
                    <a
                        href="https://github.com/navazjm/ultrashub/tree/main?tab=readme-ov-file#bug-report-or-feature-request"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-muted-foreground hover:text-current focus:text-current ml-1"
                    >
                        guidelines
                    </a>
                    . Include as much detail as possible to ensure reproducibility. At a minimum, vulnerability
                    disclosures should include:
                </p>
                <ul className="list-disc list-inside space-y-3 ml-10">
                    <li>Vulnerability Description</li>
                    <li>Proof of Concept</li>
                    <li>Impact</li>
                    <li>Screenshots or Proof</li>
                </ul>
            </section>
            <section className="space-y-5 my-5">
                <h1 id="Submission_Guidelines" className="text-3xl font-bold text-primary">
                    Submission Guidelines
                </h1>
                <p>
                    Do not engage in activities that might cause a denial of service condition, create significant
                    strains on critical resources, or negatively impact users of the site outside of test accounts.
                </p>
            </section>
        </section>
    );
};
