"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProvinceDistrictSelector } from "../damage/province-district-selector"

interface FundsFormProps {
  formData: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}

export function FundsForm({ formData, onChange }: FundsFormProps) {
  const updateField = (field: string, value: unknown) => {
    onChange({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="donorName" className="text-foreground">
            Donor Name / Organization <span className="text-destructive">*</span>
          </Label>
          <Input
            id="donorName"
            placeholder="Enter name or organization"
            value={(formData.donorName as string) || ""}
            onChange={(e) => updateField("donorName", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact" className="text-foreground">
            Contact (Email or Phone) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact"
            placeholder="Enter email or phone"
            value={(formData.contact as string) || ""}
            onChange={(e) => updateField("contact", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <ProvinceDistrictSelector formData={formData} onChange={onChange} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-foreground">
            Amount (LKR) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="amount"
            type="number"
            min="0"
            placeholder="Enter amount"
            value={(formData.amount as string) || ""}
            onChange={(e) => updateField("amount", e.target.value)}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Preferred Use</Label>
          <Select
            value={(formData.preferredUse as string) || ""}
            onValueChange={(value) => updateField("preferredUse", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select use" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="housing">Housing Repairs</SelectItem>
              <SelectItem value="schools">Schools</SelectItem>
              <SelectItem value="roads">Roads & Infrastructure</SelectItem>
              <SelectItem value="medical">Medical Aid</SelectItem>
              <SelectItem value="general">General Fund</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-foreground">Payment Method</Label>
          <Select
            value={(formData.paymentMethod as string) || ""}
            onValueChange={(value) => updateField("paymentMethod", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="online">Online Payment</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-foreground">Receipts Required?</Label>
          <Select
            value={(formData.receiptRequired as string) || ""}
            onValueChange={(value) => updateField("receiptRequired", value)}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
