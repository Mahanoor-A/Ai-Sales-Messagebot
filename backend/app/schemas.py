from pydantic import BaseModel, Field


class SalesMessageRequest(BaseModel):
    product: str = Field(..., min_length=1, max_length=120)
    deal_terms: dict[str, str] = Field(default_factory=dict)
    product_outline: list[str] = Field(default_factory=list)
    product_benefits: list[str] = Field(default_factory=list)
    product_risks: list[str] = Field(default_factory=list)
    advisor_note: str = Field(..., min_length=1, max_length=5000)
    client_name: str | None = Field(default=None, max_length=200)
    client_company: str | None = Field(default=None, max_length=300)
    suggest_subject: bool = False
    show_alternative: bool = False


class SalesMessageResponse(BaseModel):
    message: str
    subject: str | None = None
    alternative_message: str | None = None
    model: str
    generated_at: str
